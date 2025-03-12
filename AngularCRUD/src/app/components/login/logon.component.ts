import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule
import { GenericService } from '../../generic.service';  // Ruta correcta para GenericService
import { User } from '../../user';  // Ruta correcta para User

@Component({
    selector: 'app-logon',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule], // Asegura que HttpClientModule esté presente
    templateUrl: './logon.component.html',
    styleUrls: ['./logon.component.css']
})
export class LogonComponent {
    @Output() navigatePage = new EventEmitter<string>(); // Evento de navegación

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
            alert('Las contraseñas no coinciden');
        } else if (this.user.username && this.user.phone && this.user.email && this.user.password.length >= 5) {
            this.userService.create(this.user).subscribe(() => {
                alert('Registro exitoso:\n\n' + JSON.stringify({ username: this.user.username, email: this.user.email, phone: this.user.phone }, null, 4));
            }, error => {
                console.error('Error al registrar el usuario:', error);
                alert('Error al registrar el usuario. Por favor intenta nuevamente.');
            });
        } else {
            alert('Por favor completa todos los campos correctamente');
        }
    }

    cancel() {
        this.navigatePage.emit('login');
    }
}
