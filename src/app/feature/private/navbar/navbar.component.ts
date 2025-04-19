import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialsModule } from '../../../material/material.module';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MaterialsModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(private router: Router) { }

  onLogout() {
    localStorage.clear();
    // this.router.navigate(['/login']);
  }
}
