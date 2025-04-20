import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { MaterialsModule } from '../../../material/material.module';

@Component({
  selector: 'app-register-account',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialsModule,
    RouterModule
  ],
  templateUrl: './register-account.component.html',
  styleUrl: './register-account.component.scss'
})
export class RegisterAccountComponent implements OnInit, OnDestroy {

  registerForm!: FormGroup;
  hide: boolean = true;
  destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.auth.register(this.registerForm.value).pipe(
        takeUntil(this.destroy$)
      ).subscribe(
        () => {
          this.snackBar.open('Account created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'left',
            verticalPosition: 'bottom',
            panelClass: ['snack-bar']
          });
          this.router.navigate(['../login']);
        },
        () => {
          this.snackBar.open('Registration failed. Try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'left',
            verticalPosition: 'bottom',
            panelClass: ['snack-bar']
          });
        }
      );
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
        horizontalPosition: 'left',
        verticalPosition: 'bottom',
        panelClass: ['snack-bar']
      });
    }
  }
}
