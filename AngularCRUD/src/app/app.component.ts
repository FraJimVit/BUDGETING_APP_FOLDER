import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { LogonComponent } from './login/logon.component';
import { BudgetingComponent } from './budgeting/budgeting.component';
import { PerfilComponent } from './perfil/perfil.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoginComponent,
    LogonComponent,
    BudgetingComponent,
    PerfilComponent
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
