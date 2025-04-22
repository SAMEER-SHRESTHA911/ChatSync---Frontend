import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarRoutingModule } from './sidebar-routing.module';
import { SidebarComponent } from './sidebar.component';
import { MaterialsModule } from '../../../material/material.module';
import { ChannelModule } from '../channel/channel.module';


@NgModule({
  declarations: [SidebarComponent],
  imports: [
    CommonModule,
    SidebarRoutingModule,
    MaterialsModule,
    ChannelModule
  ],
  exports:[SidebarComponent]
})
export class SidebarModule { }
