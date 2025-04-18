import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ForgetPasswordService } from '../services/forget-password.service';
import * as ForgetPasswordActions from './forget-password.action';

@Injectable()
export class ForgetPasswordEffects {

  sendPasswordResetLink$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ForgetPasswordActions.sendPasswordResetLink),
      mergeMap(action =>
        this.forgetPasswordService.sendPasswordResetLink(action.email).pipe(
          map(() => ForgetPasswordActions.sendPasswordResetLinkSuccess()),
          catchError((error) => of(ForgetPasswordActions.sendPasswordResetLinkFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private forgetPasswordService: ForgetPasswordService
  ) {}
}

