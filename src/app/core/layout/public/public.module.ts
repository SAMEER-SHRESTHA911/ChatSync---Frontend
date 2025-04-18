import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public.component';


@NgModule({
  declarations: [PublicComponent],
  imports: [
    CommonModule,
    PublicRoutingModule,
    RouterModule
  ]
})
export class PublicModule { }
