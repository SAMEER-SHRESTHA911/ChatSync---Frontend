import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateRoutingModule } from './private-routing.module';
import { RouterModule } from '@angular/router';
import { PrivateComponent } from './private.component';
import { NavbarComponent } from "../../../feature/private/navbar/navbar.component";
import { SidebarComponent } from "../../../feature/private/sidebar/sidebar.component";



@NgModule({
  declarations: [PrivateComponent],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    RouterModule,
    NavbarComponent,
    SidebarComponent
  ]
})
export class PrivateModule { }
