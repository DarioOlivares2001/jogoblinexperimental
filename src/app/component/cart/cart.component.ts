import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  items: any[] = [];
  total: number = 0;

  constructor(private cartService: CartService, private router: Router ) {}

  ngOnInit() {
    this.cartService.items$.subscribe(items => {
      this.items = items;
      this.total = this.cartService.getTotal();
    });
  }

  closeCart() {
    document.body.classList.remove('showCart');
  }

  pay() {
    this.router.navigate(['/factura-component']);
    document.body.classList.remove('showCart');
  }

  changeQuantity(id: number, action: string) {
    this.cartService.changeQuantity(id, action);
    this.total = this.cartService.getTotal();
    this.triggerTotalJump();
  }

  triggerTotalJump() {
    const totalElement = document.querySelector('.total');
    if (totalElement) {
      totalElement.classList.add('total-update');
      setTimeout(() => totalElement.classList.remove('total-update'), 300);
    }
  }
}
