import { Component } from '@angular/core';
import { MaterialsModule } from '../../../material/material.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as ForgetPasswordActions from './store/forget-password.action';
import { selectLoading, selectSuccess, selectError } from './store/forget-password.selector';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [MaterialsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  forgetPasswordForm!: FormGroup;
  loading$!: Observable<boolean>;
  success$!: Observable<boolean>;
  error$!: Observable<string>;

  constructor(private fb: FormBuilder, private store: Store, private router: Router) { }

  ngOnInit(): void {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

  // this.loading$ = this.store.pipe(select(selectLoading));

    this.success$ = this.store.pipe(
      select(selectSuccess),
      tap(success => {
        if (success) {
          alert('Password reset link sent successfully! Redirecting to login...');
          this.router.navigate(['/login']);
        }
      })
    );

    this.error$ = this.store.pipe(
      select(selectError),
      tap(error => {
        if (error) {
          alert('Failed to send password reset link. Please try again.');
        }
      })
    );
  }

  onSubmit() {
    if (this.forgetPasswordForm.valid) {
      const email = this.forgetPasswordForm.get('email')?.value;
      this.store.dispatch(ForgetPasswordActions.sendPasswordResetLink({ email }));
      this.router.navigate(['/otp'])
    }

  }
}
