import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoomRoutingModule } from './chat-room-routing.module';
import { MaterialsModule } from '../../../material/material.module';
import { ChatRoomComponent } from './chat-room.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ChatRoomComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ChatRoomRoutingModule,
    MaterialsModule,
    RouterModule
  ]
})
export class ChatRoomModule { }
