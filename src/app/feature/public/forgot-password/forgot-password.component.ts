import { Component } from '@angular/core';
import { MaterialsModule } from '../../../material/material.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
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

  destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private store: Store, private router: Router) { }

  ngOnInit(): void {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.success$ = this.store.pipe(
      select(selectSuccess),
      takeUntil(this.destroy$),
      tap(success => {
        if (success) {
          alert('Password reset link sent successfully! Redirecting to login...');
          this.router.navigate(['/login']);
        }
      })
    );


    this.error$ = this.store.pipe(
      select(selectError),
      takeUntil(this.destroy$),
      tap(error => {
        if (error) {
          alert('Failed to send password reset link. Please try again.');
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  onSubmit() {
    if (this.forgetPasswordForm.valid) {
      const email = this.forgetPasswordForm.get('email')?.value;
      this.store.dispatch(ForgetPasswordActions.sendPasswordResetLink({ email }));
      this.router.navigate(['/otp'])
    }

  }
}
