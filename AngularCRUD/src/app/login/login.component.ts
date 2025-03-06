import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();
  username: string = '';
  password: string = '';

  constructor() {}

  login() {
    if (this.username === 'admin' && this.password === 'admin') {
      this.loginSuccess.emit();
    } else {
      alert('Credenciales incorrectas');
    }
  }
}
