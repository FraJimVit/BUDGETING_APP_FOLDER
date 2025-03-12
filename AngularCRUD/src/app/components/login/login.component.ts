import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() navigatePage = new EventEmitter<string>(); // Evento de navegación
  @Output() loginSuccess = new EventEmitter<void>();
  username: string = '';
  password: string = '';

  constructor() {}

  login() {
    if (this.username === 'admin' && this.password === 'admin') {
      this.loginSuccess.emit(); // Evento de éxito al iniciar sesión
    } else {
      alert('Credenciales incorrectas');
    }
  }

  navigate(page: string) {
    this.navigatePage.emit(page); // Emite el evento con la página deseada
  }
}
