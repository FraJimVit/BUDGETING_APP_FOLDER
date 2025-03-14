import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LogonComponent } from './components/login/logon.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { BudgetingComponent } from './components/budgeting/budgeting.component';
import { MonthlyComponent } from './components/budgeting/monthly.component';
import { ExpensesComponent } from './components/budgeting/expenses.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoginComponent,
    LogonComponent,
    PerfilComponent,
    BudgetingComponent,
    MonthlyComponent,
    ExpensesComponent
  ],
  templateUrl: './app.component.html',
  styles: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  currentPage: string = 'login'; // Página inicial

  navigate(page: string) {
    this.currentPage = page; // Método para cambiar la página actual
  }

  logout() {
    this.currentPage = 'login'; // Método para cambiar a login al hacer logout
  }
}
