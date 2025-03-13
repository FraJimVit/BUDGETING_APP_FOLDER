import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GenericService } from '../../generic.service';
import Swal from 'sweetalert2';

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

  constructor(private userService: GenericService<any>) {}

  login() {
    console.log("Intentando iniciar sesión con:", { username: this.username, password: this.password });
    this.userService.authenticate(this.username, this.password).subscribe(
      (user: any) => {
        if (user) {
          console.log("Usuario autenticado:", user);
          this.showNotification('Inicio de sesión exitoso', 'success');
          setTimeout(() => {
            this.loginSuccess.emit(); // Evento de éxito al iniciar sesión
          }, 3000);
        } else {
          this.showNotification('Credenciales incorrectas', 'error');
        }
      },
      (error: any) => {
        console.error('Error al autenticar el usuario:', error);
        this.showNotification('Error al autenticar el usuario. Por favor intenta nuevamente.', 'error');
      }
    );
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

  navigate(page: string) {
    this.navigatePage.emit(page); // Emite el evento con la página deseada
  }
}
