import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  isEditing: boolean = false; // Variable para controlar el modo de edición

  user = {
    name: 'Nombre del Usuario',
    email: 'usuario@example.com',
    phone: '+123 456 7890',
  };

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }
}
