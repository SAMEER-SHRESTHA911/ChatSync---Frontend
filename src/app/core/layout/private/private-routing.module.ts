import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateComponent } from './private.component';
import { ROUTE_CONSTANT } from '../../constants/route.constants';

const routes: Routes = [
  {
    path: '',
    component: PrivateComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../../../feature/private/private.module').then(m => m.PrivateModule)
      },
      {
        path: ROUTE_CONSTANT.channel,
        loadChildren: () => import('../../../feature/private/chat-room/chat-room.module').then(m => m.ChatRoomModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
