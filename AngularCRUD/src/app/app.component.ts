import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { GenericService } from './generic.service';
import { Observable } from 'rxjs';
import { Product } from './product';
import Swal from 'sweetalert2'; // Importa SweetAlert2

interface Expense {
  name: string;
  amount: number;
}

interface Category {
  name: string;
  amount: number;
  newExpenseName: string;
  newExpenseAmount: number;
  expenses: Expense[];
  expanded: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, FormsModule],
  providers: [GenericService],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent implements OnInit {
  amount: string = ''; // Inicializamos la propiedad 'amount' como string
  notification: string | null = null; // Propiedad para las notificaciones
  budgetSaved: boolean = false; // Propiedad para indicar si el presupuesto se ha guardado

  // Propiedad para las categorías y sus gastos
  categories: Category[] = [
    { name: 'Housing', amount: 0, newExpenseName: '', newExpenseAmount: 0, expenses: [], expanded: false },
    { name: 'Food', amount: 0, newExpenseName: '', newExpenseAmount: 0, expenses: [], expanded: false },
    { name: 'Transport', amount: 0, newExpenseName: '', newExpenseAmount: 0, expenses: [], expanded: false },
    { name: 'Entertainment', amount: 0, newExpenseName: '', newExpenseAmount: 0, expenses: [], expanded: false }
  ];

  constructor(private service: GenericService<Product>){}

  ngOnInit(): void {
    // Puedes agregar lógica de inicialización aquí si es necesario
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
      this.budgetSaved = true; // Indicar que el presupuesto se ha guardado
      this.showNotification(`Monthly Budget Saved: ${numericValue}`, 'success');
    } else {
      this.showNotification('Please enter a valid amount.', 'error');
    }
  }

  addExpense(category: Category) {
    if (category.newExpenseName && category.newExpenseAmount) {
      category.expenses.push({ name: category.newExpenseName, amount: category.newExpenseAmount });
      category.newExpenseName = '';
      category.newExpenseAmount = 0;
      this.showNotification('Expense Added', 'success');
    } else {
      this.showNotification('Please enter valid expense details.', 'error');
    }
  }

  saveExpenses() {
    // Aquí puedes guardar los gastos ingresados por categoría
    console.log('Expenses:', this.categories);
    this.showNotification('Expenses Saved', 'success');
  }

  calculateUsedBudget(category: Category) {
    // Calcular el presupuesto utilizado para cada categoría
    return category.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  calculateRemainingBudget() {
    // Calcular el presupuesto restante general
    const totalExpenses = this.categories.reduce((sum, category) => sum + this.calculateUsedBudget(category), 0);
    return parseFloat(this.amount.replace(/,/g, '')) - totalExpenses;
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
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      position: 'top-end',
      toast: true,
      icon: type // Cambia el ícono según el tipo de notificación
    });
  }

  editExpense(category: Category, index: number) {
    const expense = category.expenses[index];
    const newName = prompt('Edit expense name:', expense.name);
    const newAmount = parseFloat(prompt('Edit expense amount:', expense.amount.toString()) || '0');
  
    if (newName !== null && !isNaN(newAmount)) {
      category.expenses[index] = { name: newName, amount: newAmount };
      this.showNotification('Expense updated successfully!', 'success');
    } else {
      this.showNotification('Invalid input. Expense not updated.', 'error');
    }
  }
  
  deleteExpense(category: Category, index: number) {
    if (confirm('Are you sure you want to delete this expense?')) {
      category.expenses.splice(index, 1); // Eliminar el gasto de la lista
      this.showNotification('Expense deleted successfully!', 'success');
    }
  }
  
}
