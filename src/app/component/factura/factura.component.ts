import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { InvoiceService } from '../../services/invoice.service'; // Importar InvoiceService

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {
  items: any[] = [];
  total: number = 0;
  userInfo = {
    nombre: '',
    email: '',
    direccion: ''
  };
  orderNumber: number = 0; // Campo para el número de orden de venta
  invoiceNumber: number = 0; // Campo para el número de factura

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private invoiceService: InvoiceService // Agregar InvoiceService al constructor
  ) {}

  ngOnInit() {
    this.items = this.cartService.getCartFromLocalStorage();
    this.total = this.cartService.getTotal();
    this.cartService.clearCart();

    const username = this.authService.getUsername();
    if (username) {
      this.userService.getUserByUsername(username).subscribe(user => {
        if (user) {
          this.userInfo.nombre = user.username;
          this.userInfo.email = user.email;
          this.userInfo.direccion = user.address || 'No disponible';
          this.orderNumber = this.generateOrderNumber(); // Generar el número de orden de venta
          this.invoiceNumber = this.generateInvoiceNumber(); // Generar el número de factura
          this.saveInvoice(); // Guardar la factura después de obtener la información del usuario
        }
      });
    }
  }

  generateOrderNumber(): number {
    // Lógica para generar un número de orden de venta
    return Math.floor(Math.random() * 1000000);
  }

  generateInvoiceNumber(): number {
    // Lógica para generar un número de factura
    return Math.floor(Math.random() * 1000000);
  }

  saveInvoice() {
    const invoice = {
      id: 0,
      orderNumber: this.orderNumber,
      invoiceNumber: this.invoiceNumber,
      items: this.items,
      total: this.total,
      userInfo: this.userInfo,
      date: new Date().toISOString()
    };

    this.invoiceService.addInvoice(invoice); // Usar InvoiceService para guardar la factura
  }
}
