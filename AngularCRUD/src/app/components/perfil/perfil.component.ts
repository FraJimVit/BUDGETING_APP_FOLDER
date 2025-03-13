import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenericService } from '../../generic.service';
import { User } from '../../user';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  isEditing: boolean = false; // Variable para controlar el modo de edición
  user: User = {
    id: '',
    username: '',
    email: '',
    phone: '',
    password: ''
  };

  constructor(private userService: GenericService<User>) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.userService.getUserBySession().subscribe(
      (user: User | null) => {
        if (user) {
          this.user = user;
          console.log('Datos del usuario:', this.user); // Añadir log para verificar los datos del usuario
        }
      },
      (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    );
  }

  toggleEdit() {
    if (this.isEditing) {
      this.userService.updateUser(this.user).subscribe(
        () => {
          console.log('Usuario actualizado con éxito');
        },
        (error) => {
          console.error('Error al actualizar el usuario:', error);
        }
      );
    }
    this.isEditing = !this.isEditing;
  }
}
