import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { GenericService } from './generic.service';
import { Observable } from 'rxjs';
import { Product } from './product';
import Swal from 'sweetalert2'; // Importa SweetAlert2

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, FormsModule],
  providers: [GenericService],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent implements OnInit {
  amount: string = ''; // Inicializamos la propiedad 'amount' como string
  notification: string | null = null; // Propiedad para las notificaciones

  constructor(private service: GenericService<Product>){}

  ngOnInit(): void {
    // Puedes agregar lógica de inicialización aquí si es necesario
  }

  formatAmount() {
    const numericValue = parseFloat(this.amount.replace(/,/g, ''));
    if (!isNaN(numericValue)) {
      this.amount = numericValue.toLocaleString('en-US');
    }
  }

  saveBudget() {
    const numericValue = parseFloat(this.amount.replace(/,/g, ''));
    if (!isNaN(numericValue)) {
      console.log(`Monthly Budget: ${numericValue}`);
      this.showNotification(`Monthly Budget Saved: ${numericValue}`, 'success');
    } else {
      this.showNotification('Please enter a valid amount.', 'error');
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.saveBudget();
    }
  }

  showNotification(message: string, type: 'success' | 'error') {
    Swal.fire({
      text: message,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      position: 'top-end',
      toast: true,
      icon: type // Cambia el ícono según el tipo de notificación
    });
  }
}













// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterOutlet } from '@angular/router';
// import { HttpClientModule } from '@angular/common/http';
// import { GenericService } from './generic.service';
// import { Observable } from 'rxjs';
// import { Product } from './product';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, RouterOutlet, HttpClientModule, FormsModule],
//   providers: [GenericService],
//   templateUrl: './app.component.html',
//   styles: [],
// })
// export class AppComponent implements OnInit {
//   products$!: Observable<Product[]>;
//   id = 0; name = ''; price = 0;

//   constructor(private service: GenericService<Product>){}

//   ngOnInit(): void {
//       this.list();
//   }

//   add() { 
//     this.service.create({ id: 0, name: this.name, price: this.price }).subscribe(() => this.list());
//   }

//   update() { 
//     this.service.update({ id: this.id, name: this.name, price: this.price }).subscribe(() => this.list());
//   }

//   delete() { 
//     this.service.delete(this.id).subscribe(() => this.list());
//   }

//   getById() { 
//     this.service.getById(this.id).subscribe((p) => {
//       this.price = p.price;
//       this.name = p.name;
//     });
//   }

//   list() { this.products$ = this.service.get(); }
// }
