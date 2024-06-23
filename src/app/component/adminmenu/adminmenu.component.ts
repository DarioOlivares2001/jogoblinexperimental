import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-adminmenu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './adminmenu.component.html',
  styleUrls: ['./adminmenu.component.css']
})
export class AdminmenuComponent {
  isMenuOpen: boolean = false;

  toggleAdminMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.classList.toggle('showAdmin');
  }
}
