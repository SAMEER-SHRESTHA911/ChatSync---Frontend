import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ChannelActions from './channel.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ChannelService } from '../service/channel.service';

@Injectable()
export class ChannelEffects {

    constructor(
        private actions$: Actions,
        private channelService: ChannelService
    ) { }

    loadRooms$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ChannelActions.loadRooms),
            mergeMap(() =>
                this.channelService.getRoomList().pipe(
                    map(data => ChannelActions.loadRoomsSuccess({ data })),
                    catchError(error => of(ChannelActions.loadRoomsFailure({ error })))
                )
            )
        )
    );

    createRoom$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ChannelActions.createRoom),
            mergeMap(action =>
                this.channelService.createRoom(action.payload).pipe(
                    map(data => ChannelActions.createRoomSuccess({ data })),
                    catchError(error => of(ChannelActions.createRoomFailure({ error })))
                )
            )
        )
    );

    joinLeaveRoom$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ChannelActions.joinLeaveRoom),
            mergeMap(action =>
                this.channelService.joinLeaveRoom(action.join, action.roomId).pipe(
                    map(data => ChannelActions.joinLeaveRoomSuccess({ data })),
                    catchError(error => of(ChannelActions.joinLeaveRoomFailure({ error })))
                )
            )
        )
    );
}
