import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter } from '@angular/material/core';
import { GenericService } from '../../generic.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { PerfilComponent } from '../perfil/perfil.component';

interface Expense {
  name: string;
  amount: number;
}

interface Category {
  name: string;
  amount: number;
  newExpenseName: string;
  newExpenseAmount: number;
  expenses: { [date: string]: Expense[] };
  expanded: boolean;
}

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
    PerfilComponent // Importa el componente de perfil
  ],
  providers: [GenericService],
  templateUrl: './expenses.component.html',
  styles: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ExpensesComponent implements OnInit {
  amount: string = '';
  notification: string | null = null;
  budgetSaved: boolean = false;
  selectedDate: Date | null = null;
  categories: Category[] = [
    {
      name: 'Housing',
      amount: 0,
      newExpenseName: '',
      newExpenseAmount: 0,
      expenses: {},
      expanded: false,
    },
    {
      name: 'Food',
      amount: 0,
      newExpenseName: '',
      newExpenseAmount: 0,
      expenses: {},
      expanded: false,
    },
    {
      name: 'Transport',
      amount: 0,
      newExpenseName: '',
      newExpenseAmount: 0,
      expenses: {},
      expanded: false,
    },
    {
      name: 'Entertainment',
      amount: 0,
      newExpenseName: '',
      newExpenseAmount: 0,
      expenses: {},
      expanded: false,
    },
  ];

  constructor(
    private dateAdapter: DateAdapter<Date>
  ) {}

  ngOnInit(): void {
    this.dateAdapter.setLocale('en-GB');
  }

  formatAmount() {
    const numericValue = parseFloat(this.amount.replace(/,/g, ''));
    if (!isNaN(numericValue)) {
      this.amount = numericValue.toLocaleString('en-US');
    }
  }

  saveBudget() {
    const numericValue = parseFloat(this.amount.replace(/,/g, ''));
    if (!isNaN(numericValue)) {
      console.log(`Monthly Budget: ${numericValue}`);
      this.budgetSaved = true;
      this.showNotification(`Monthly Budget Saved: ${numericValue}`, 'success');
    } else {
      this.showNotification('Please enter a valid amount.', 'error');
    }
  }

  addExpense(category: Category) {
    if (category.newExpenseName && category.newExpenseAmount) {
      const dateKey = this.selectedDate ? this.selectedDate.toISOString().split('T')[0] : '';
      if (!category.expenses[dateKey]) {
        category.expenses[dateKey] = [];
      }
      category.expenses[dateKey].push({
        name: category.newExpenseName,
        amount: category.newExpenseAmount,
      });
      category.newExpenseName = '';
      category.newExpenseAmount = 0;
      this.showNotification('Expense Added', 'success');
    } else {
      this.showNotification('Please enter valid expense details.', 'error');
    }
  }

  saveExpenses() {
    console.log('Expenses:', this.categories);
    this.showNotification('Expenses Saved', 'success');
  }

  calculateUsedBudget(category: Category) {
    return Object.values(category.expenses).reduce((sum, dailyExpenses) => {
      return (
        sum +
        dailyExpenses.reduce((dailySum, expense) => dailySum + expense.amount, 0)
      );
    }, 0);
  }

  calculateRemainingBudget() {
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
              (dailySum, expense) => dailySum + expense.amount,
              0
            ),
          0
        );
      return sum + expenseSum;
    }, 0);

    return parseFloat(this.amount.replace(/,/g, '')) - totalMonthlyExpenses;
  }

  toggleCategory(category: Category) {
    category.expanded = !category.expanded;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.saveBudget();
    }
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
      category.expenses[dateKey][index] = { name: newName, amount: newAmount };
      this.showNotification('Expense updated successfully!', 'success');
    } else {
      this.showNotification('Invalid input. Expense not updated.', 'error');
    }
  }

  deleteExpense(category: Category, dateKey: string, index: number) {
    if (confirm('Are you sure you want to delete this expense?')) {
      category.expenses[dateKey].splice(index, 1);
      this.showNotification('Expense deleted successfully!', 'success');
    }
  }

  onDateChange(event: any) {
    this.selectedDate = event.value;
  }
}
