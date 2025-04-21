import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarRoutingModule } from './sidebar-routing.module';
import { SidebarComponent } from './sidebar.component';
import { MaterialsModule } from '../../../material/material.module';


@NgModule({
  declarations: [SidebarComponent],
  imports: [
    CommonModule,
    SidebarRoutingModule,
    MaterialsModule
  ],
  exports:[SidebarComponent]
})
export class SidebarModule { }
