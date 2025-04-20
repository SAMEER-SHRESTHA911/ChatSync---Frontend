import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { LoginPayload } from '../../../core/models/interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hide: boolean = true;

  destroy$ = new Subject<void>();

  constructor(
    private auth: AuthService,
    private router: Router, private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  onSubmit(): void {
    console.log(this.loginForm)
    console.log(this.loginForm.valid)
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value as LoginPayload).pipe(
        takeUntil(this.destroy$)
      )
        .subscribe(
          (result) => {
            console.log(result)
            this.router.navigate(['home']);
            this.openSnackBar('LogIn Successfully')
          },
          (err) => {
            this.openSnackBar('Failed to Login')
          }
        );
    } else {
      this.openSnackBar('Invalid Email or Password')
    }
  }

  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
      panelClass: ['snack-bar']
    });

  }
}