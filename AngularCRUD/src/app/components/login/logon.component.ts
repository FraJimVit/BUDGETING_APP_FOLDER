import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GenericService } from '../../generic.service';
import { User } from '../../user';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-logon',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './logon.component.html',
    styleUrls: ['./logon.component.css']
})
export class LogonComponent {
    @Output() navigatePage = new EventEmitter<string>();

    user: User = {
        id: '',
        username: '',
        phone: '',
        email: '',
        password: ''
    };
    confirmpassword: string = '';

    constructor(private userService: GenericService<User>) {}

    onSubmit() {
        if (this.user.password !== this.confirmpassword) {
            this.showNotification('Las contraseñas no coinciden', 'error');
        } else if (this.user.username && this.user.phone && this.user.email && this.user.password.length >= 5) {
            this.userService.create(this.user).subscribe(() => {
                this.showNotification('Registro exitoso', 'success');
                setTimeout(() => {
                    this.navigatePage.emit('login'); // Redirige a la página de login
                }, 3000); // Espera 3 segundos antes de redirigir
            }, error => {
                console.error('Error al registrar el usuario:', error);
                this.showNotification('Error al registrar el usuario. Por favor intenta nuevamente.', 'error');
            });
        } else {
            this.showNotification('Por favor completa todos los campos correctamente', 'error');
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

    cancel() {
        this.navigatePage.emit('login');
    }
}
