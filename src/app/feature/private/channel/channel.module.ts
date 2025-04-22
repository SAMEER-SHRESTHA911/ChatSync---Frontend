import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChannelRoutingModule } from './channel-routing.module';
import { MaterialsModule } from '../../../material/material.module';
import { ChannelComponent } from './channel.component';
import { AddChannelComponent } from './add-channel/add-channel.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ChannelEffects } from './store/channel.effect';
import { channelReducer } from './store/channel.reducer';


@NgModule({
  declarations: [
    ChannelComponent,
    AddChannelComponent,
  ],
  imports: [
    CommonModule,
    ChannelRoutingModule,
    MaterialsModule,
    // StoreModule.forFeature('channel', channelReducer),
    // EffectsModule.forFeature([ChannelEffects]),
  ],
  exports: [
    ChannelComponent,  
  ]
})
export class ChannelModule { }
