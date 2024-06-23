import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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

  constructor(private cartService: CartService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.items = this.cartService.getCartFromLocalStorage();
    this.total = this.cartService.getTotal();
    this.cartService.clearCart();

    const username = this.authService.getUsername();
    if (username) {
      const user = this.getUserByUsername(username);
      if (user) {
        this.userInfo.nombre = user.username;
        this.userInfo.email = user.email;
        this.userInfo.direccion = user.address || 'No disponible';
      }
    }
  }

  getUserByUsername(username: string) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find((user: any) => user.username === username);
  }
}
