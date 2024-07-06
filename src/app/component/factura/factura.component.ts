import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

/**
 * Componente para la visualización de la factura.
 */
@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {
  /**
   * Lista de ítems en la factura.
   */
  items: any[] = [];

  /**
   * Total de la factura.
   */
  total: number = 0;

  /**
   * Información del usuario.
   */
  userInfo = {
    nombre: '',
    email: '',
    direccion: ''
  };

  /**
   * Constructor del componente.
   * @param cartService - Servicio del carrito para manejar operaciones relacionadas con el carrito.
   * @param authService - Servicio de autenticación para manejar el estado del usuario.
   * @param router - Router para la navegación.
   * @param userService - Servicio de usuarios para manejar operaciones relacionadas con usuarios.
   */
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  /**
   * Método de inicialización.
   */
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
        }
      });
    }
  }
}
