import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { GenericService } from '../../generic.service';
import { Expense, Category } from '../../expenses';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [GenericService],
  templateUrl: './expenses.component.html',
  styles: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ExpensesComponent implements OnInit {
  userId: string | null = null; // ID de usuario autenticado
  amount: string = '';
  selectedDate: Date | null = null;
  monthlyBudget: any = null; // Para almacenar los datos del presupuesto mensual

  categories: Category[] = [
    {
      name: 'Housing',
      expanded: false,
      expenses: {},
    },
    {
      name: 'Food',
      expanded: false,
      expenses: {},
    },
    {
      name: 'Transport',
      expanded: false,
      expenses: {},
    },
    {
      name: 'Entertainment',
      expanded: false,
      expenses: {},
    },
  ];

  constructor(private dateAdapter: DateAdapter<Date>, private genericService: GenericService<any>) {}

  ngOnInit(): void {
    this.dateAdapter.setLocale('en-GB');
    this.loadUserId(); // Método para cargar el ID de usuario
  }

  loadUserId() {
    this.userId = localStorage.getItem('userId'); // Obtén el ID de usuario del almacenamiento local
    if (this.userId === null) {
      this.showNotification('User ID is null. Please log in again.', 'error');
    }
    // console.log('Loaded User ID:', this.userId);
  }

  addExpense(category: Category) {
    if (category.newExpenseName && category.newExpenseAmount) {
      const dateKey = this.selectedDate ? this.selectedDate.toISOString().split('T')[0] : '';
      if (!category.expenses[dateKey]) {
        category.expenses[dateKey] = [];
      }
      category.expenses[dateKey].push({
        id: '',
        userId: this.userId!,
        monthlyBudgetId: `${this.userId}-${this.selectedDate?.getFullYear()}-${this.selectedDate?.getMonth()! + 1}`,
        date: dateKey,
        name: category.newExpenseName,
        amount: category.newExpenseAmount,
        categoryName: category.name
      });
      category.newExpenseName = '';
      category.newExpenseAmount = 0;
      this.showNotification('Expense Added', 'success');
    } else {
      this.showNotification('Please enter valid expense details.', 'error');
    }
  }

  loadExpenses() {
    if (this.userId) {
      this.genericService.getExpensesByUserId(this.userId).subscribe(
        (expenses: Expense[]) => {
          // Reinicia las expenses de las categorías
          this.categories.forEach(category => (category.expenses = {}));
  
          // Agrupa los gastos directamente en función de categoryName
          expenses.forEach(expense => {
            const category = this.categories.find(cat => cat.name === expense.categoryName);
            if (category) {
              const dateKey = expense.date.split('T')[0]; // Asegura formato YYYY-MM-DD
              if (!category.expenses[dateKey]) {
                category.expenses[dateKey] = [];
              }
              category.expenses[dateKey].push(expense);
            }
          });
  
          console.log('Expenses loaded and assigned:', this.categories);
          this.showNotification('Expenses loaded successfully.', 'success');
        },
        error => {
          console.error('Error loading expenses:', error);
          this.showNotification('Failed to load expenses. Please try again.', 'error');
        }
      );
    }
  }
  
  

  saveExpenses() {
    console.log('Expenses:', this.categories);

    const expensesToSave = this.categories.flatMap(category =>
      Object.values(category.expenses).flat()
    );
  
    console.log('Expenses to save:', expensesToSave);
    this.genericService.createExpense(expensesToSave).subscribe(
      response => {
        if (response.success) {
          this.showNotification('Expenses saved successfully!', 'success');
          console.log('Response from server:', response);
        } else {
          this.showNotification('Failed to save expenses. Please try again.', 'error');
          console.error('Unexpected response format:', response);
        }
      },
      error => {
        console.error('Error saving expenses:', error);
        this.showNotification('Failed to save expenses. Please try again.', 'error');
      }
    );    
        
  }

  calculateUsedBudget(category: Category): number {
    return Object.values(category.expenses).reduce((sum, dailyExpenses) => {
      return (
        sum +
        dailyExpenses.reduce((dailySum, expense) => dailySum + expense.amount, 0)
      );
    }, 0);
  }

  calculateRemainingBudget(): number {
    const totalMonthlyExpenses = this.categories.reduce((sum, category) => {
      const expenseSum = Object.keys(category.expenses)
        .filter((dateKey) =>
          dateKey.startsWith(
            this.selectedDate ? this.selectedDate.toISOString().substring(0, 7) : ''
          )
        )
        .reduce(
          (dateSum, dateKey) =>
            dateSum +
            category.expenses[dateKey].reduce(
              (dailySum, expense) => dailySum + (expense.amount || 0),
              0
            ),
          0
        );
      return sum + expenseSum;
    }, 0);
  
    const parsedAmount = parseFloat(this.amount.replace(/,/g, '')) || 0; // Asegura que sea un número
    return parsedAmount - totalMonthlyExpenses;
  }

  toggleCategory(category: Category) {
    category.expanded = !category.expanded;
  }

  showNotification(message: string, type: 'success' | 'error') {
    Swal.fire({
      text: message,
      timer: 1000,
      timerProgressBar: true,
      showConfirmButton: false,
      position: 'top-end',
      toast: true,
      icon: type,
    });
  }

  editExpense(category: Category, dateKey: string, index: number) {
    const expense = category.expenses[dateKey][index];
    const newName = prompt('Edit expense name:', expense.name);
    const newAmount = parseFloat(
      prompt('Edit expense amount:', expense.amount.toString()) || '0'
    );

    if (newName !== null && !isNaN(newAmount)) {
      category.expenses[dateKey][index] = { ...expense, name: newName, amount: newAmount };
      this.showNotification('Expense updated successfully!', 'success');
    } else {
      this.showNotification('Invalid input. Expense not updated.', 'error');
    }
  }

  deleteExpense(category: Category, dateKey: string, index: number) {
    if (confirm('Are you sure you want to delete this expense?')) {
      const expense = category.expenses[dateKey][index]; // Obtén el gasto a eliminar
  
      this.genericService.deleteExpense(expense.id).subscribe(
        () => {
          // Elimina localmente si la solicitud al backend tuvo éxito
          category.expenses[dateKey].splice(index, 1);
          this.showNotification('Expense deleted successfully!', 'success');
        },
        error => {
          console.error('Error deleting expense:', error);
          this.showNotification('Failed to delete expense. Please try again.', 'error');
        }
      );
    }
  }  

  onDateChange(event: any) {
    this.selectedDate = event.value;

    if (this.userId) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Los meses comienzan en 0
  
      this.genericService.checkBudgetForMonth(this.userId, year, month).subscribe(
        (budget) => {
          this.monthlyBudget = budget;
          this.amount = budget.amount ? budget.amount.toString() : '0'; // Asigna el monto del presupuesto a la variable de `amount`
        },
        (error) => {
          console.error('Error al obtener el presupuesto mensual:', error);
          this.showNotification('No se pudo cargar el presupuesto mensual.', 'error');
        }
      );
    }

    this.loadExpenses();
  }
}
