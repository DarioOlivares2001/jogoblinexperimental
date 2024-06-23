import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { RegisterComponent } from '../auth/register/register.component';
import { AdminmenuComponent } from '../adminmenu/adminmenu.component';
import { AdminproductosComponent } from '../adminproductos/adminproductos.component';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule, LoginComponent, RegisterComponent, AdminmenuComponent, AdminproductosComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  cartItemCount: number = 0;
  heartbeat: boolean = false;
  username: string | null = null;

  constructor(private authService: AuthService, private cartService: CartService) {}

  ngOnInit() {
    this.authService.isAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });

    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    this.authService.username$.subscribe(username => {
      this.username = username;
    });

    this.cartService.items$.subscribe(items => {
      this.cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
      this.heartbeat = true;
      setTimeout(() => this.heartbeat = false, 600);
    });
  }

  showCart() {
    document.body.classList.toggle('showCart');
  }

  toggleAdminMenu() {
    document.body.classList.toggle('showAdmin');
  }

  logout() {
    this.authService.logout();
  }
}
