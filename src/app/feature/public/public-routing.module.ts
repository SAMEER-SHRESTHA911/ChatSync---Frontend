import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { ROUTE_CONSTANT } from '../../core/constants/route.constants';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

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
    path: ROUTE_CONSTANT.registerAccount,
    loadComponent: () => import('./register-account/register-account.component').then(m => m.RegisterAccountComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
