import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateComponent } from './private.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    PrivateComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class PrivateModule { }
