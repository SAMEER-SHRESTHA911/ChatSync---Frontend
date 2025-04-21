import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateRoutingModule } from './private-routing.module';
import { RouterModule } from '@angular/router';
import { PrivateComponent } from './private.component';
import { NavbarComponent } from "../../../feature/private/navbar/navbar.component";
import { SidebarModule } from '../../../feature/private/sidebar/sidebar.module';

@NgModule({
  declarations: [PrivateComponent],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    RouterModule,
    NavbarComponent,
    SidebarModule
  ]
})
export class PrivateModule { }
