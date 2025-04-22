import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateComponent } from './private.component';
import { ROUTE_CONSTANT } from '../../core/constants/route.constants';
import { authGuard } from '../../core/guards/auth.guard';

const {
  channel
} = ROUTE_CONSTANT;

const routes: Routes = [
  {
    path: '',
    component: PrivateComponent,
  },
  {
    path: channel,
    canActivate: [authGuard],
    loadChildren: () => import('./chat-room/chat-room.module').then(m => m.ChatRoomModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
