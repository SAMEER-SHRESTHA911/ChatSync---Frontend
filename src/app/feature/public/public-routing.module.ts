import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTE_CONSTANT } from '../../core/constants/route.constants';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OtpComponent } from './otp/otp.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch:'full'
  },
  {
    path: ROUTE_CONSTANT.login,
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: ROUTE_CONSTANT.forgotPassword,
    component:ForgotPasswordComponent
  },
  {
    path: ROUTE_CONSTANT.otp,
    component:OtpComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
