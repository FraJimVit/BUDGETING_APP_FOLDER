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

@Component({
  selector: 'app-monthly',
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
  templateUrl: './monthly.component.html',
  styles: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MonthlyComponent implements OnInit {
  selectedMonth: number | null = null;
  selectedYear: number | null = null;
  amount: string = '';
  budgetSaved: boolean = false;

  userId: string | null = null; // ID de usuario autenticado

  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' },
  ];

  years: number[] = [];

  constructor(private dateAdapter: DateAdapter<Date>, private genericService: GenericService<any>) {}

  ngOnInit(): void {
    this.dateAdapter.setLocale('en-GB');
    this.initializeYears();
    this.setCurrentDate();
    this.loadUserId(); // Método para cargar el ID de usuario
  }

  initializeYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
      this.years.push(year);
    }
  }

  setCurrentDate() {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1; // Ajuste del mes al cargar la fecha actual
    this.selectedYear = currentDate.getFullYear();
  }

  loadUserId() {
    this.userId = localStorage.getItem('userId'); // Obtén el ID de usuario del almacenamiento local
    if (this.userId === null) {
      this.showNotification('User ID is null. Please log in again.', 'error');
    }
    // console.log('Loaded User ID:', this.userId);
  }

  formatAmount() {
    if (this.amount.trim() === '') {
      this.showNotification('Please enter a valid amount.', 'error');
      return;
    }

    const numericValue = parseFloat(this.amount.replace(/,/g, ''));
    if (!isNaN(numericValue)) {
      this.amount = numericValue.toLocaleString('en-US');
    } else {
      this.showNotification('Please enter a valid amount.', 'error');
    }
  }

  saveBudget() {
    this.formatAmount(); // Formatea y valida el monto antes de continuar

    const numericValue = parseFloat(this.amount.replace(/,/g, ''));

    if (!isNaN(numericValue) && numericValue > 0 && this.userId !== null) {
      const month = this.selectedMonth !== null ? this.selectedMonth : 1; // Asegurarse de que el mes no sea nulo
      const year = this.selectedYear !== null ? this.selectedYear : new Date().getFullYear();

      // console.log('Proceeding to check budget for month and year...');

      this.genericService.checkBudgetForMonth(this.userId, year, month).subscribe({
        next: (existingBudget) => {
          if (existingBudget) {
            Swal.fire({
              title: 'Budget Exists',
              text: 'A budget for this month already exists. Do you want to update it?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, update it!',
              cancelButtonText: 'No, cancel',
            }).then((result) => {
              if (result.value) {
                this.saveOrUpdateBudget(numericValue, month, year);
              }
            });
          } else {
            this.saveOrUpdateBudget(numericValue, month, year);
          }
        },
        error: (error) => {
          if (error.status === 404) { // Manejar el caso donde no se encontró el presupuesto
            console.log('No budget found, proceeding to save new budget.');
            this.saveOrUpdateBudget(numericValue, month, year);
          } else {
            console.error('Error checking budget:', error);
            this.showNotification('Error checking budget. Details: ' + error.message, 'error'); // Notificar el error con más detalles
          }
        },
      });
    } else {
      if (this.userId === null) {
        this.showNotification('User ID is null. Please log in again.', 'error');
      } else {
        this.showNotification('Please enter a valid amount.', 'error');
      }
    }
  }


  saveOrUpdateBudget(amount: number, month: number, year: number) {
    const budget = {
        userId: this.userId,
        month,
        year,
        amount,
    };

    // console.log('Saving budget:', budget); // Mensaje de depuración para confirmar los datos del presupuesto

    this.genericService.saveBudget(budget).subscribe({
        next: (response) => {
            // console.log('Budget saved successfully:', response); // Confirmar que el presupuesto se ha guardado
            this.budgetSaved = true;
            this.showNotification(`Monthly Budget Saved: ${amount}`, 'success');
        },
        error: (error) => {
            // console.error('Error saving budget:', error); // Manejo de errores
            this.showNotification('Error saving budget. Details: ' + error.message, 'error'); // Notificar el error con más detalles
        },
    });
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
      icon: type,
    });
  }
}
