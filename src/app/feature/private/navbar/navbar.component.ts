import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialsModule } from '../../../material/material.module';
import { AuthService } from '../../../core/services/auth.service';
import { WebsocketService } from '../service/websocket.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MaterialsModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(private router: Router, private authService: AuthService,
    private websocketService: WebsocketService) { }

  onLogout() {
    this.websocketService.disconnect();
    this.authService.clearToken();
  }
}