import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-logon',
    standalone: true,
    imports: [CommonModule, FormsModule], // Asegura que FormsModule esté presente
    templateUrl: './logon.component.html',
    styleUrls: ['./logon.component.css']
})
export class LogonComponent {
    @Output() navigatePage = new EventEmitter<string>(); // Evento de navegación

    username: string = ''; // Propiedad enlazada al formulario
    email: string = '';    // Propiedad enlazada al formulario
    password: string = ''; // Propiedad enlazada al formulario
    phone: string = '';    // Propiedad enlazada al formulario
    confirmpassword: string = ''; // Propiedad enlazada al formulario

    onSubmit() {
        if (this.password !== this.confirmpassword) {
            alert('Las contraseñas no coinciden');
        }
        else if (this.username &&  this.phone && this.email && this.password.length >= 5) {
            alert('Registro exitoso:\n\n' + JSON.stringify({ username: this.username, email: this.email, phrone: this.phone }, null, 4));
        } else {
            alert('Por favor completa todos los campos correctamente');
        }
    }

    cancel() {
        this.navigatePage.emit('login'); // Emite el evento para navegar al login
    }
      
}
