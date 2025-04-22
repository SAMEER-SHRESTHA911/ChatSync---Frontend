import { createAction, props } from '@ngrx/store';
import { ChannelListDatum, CreateRoomPayload } from '../models/channel.interface';
import { ResponseIdentity } from '../../../../core/models/interface';

export const loadRooms = createAction('[Channel] Load Rooms');
export const loadRoomsSuccess = createAction(
    '[Channel] Load Rooms Success',
    props<{ data: ResponseIdentity<ChannelListDatum[]> }>()
);
export const loadRoomsFailure = createAction(
    '[Channel] Load Rooms Failure',
    props<{ error: any }>()
);

export const createRoom = createAction(
    '[Channel] Create Room',
    props<{ payload: CreateRoomPayload }>()
);
export const createRoomSuccess = createAction(
    '[Channel] Create Room Success',
    props<{ data: ResponseIdentity<ChannelListDatum> }>()
);
export const createRoomFailure = createAction(
    '[Channel] Create Room Failure',
    props<{ error: any }>()
);

export const joinLeaveRoom = createAction(
    '[Channel] Join/Leave Room',
    props<{ join: boolean; roomId: number }>()
);
export const joinLeaveRoomSuccess = createAction(
    '[Channel] Join/Leave Room Success',
    props<{ data: ResponseIdentity<string> }>()
);
export const joinLeaveRoomFailure = createAction(
    '[Channel] Join/Leave Room Failure',
    props<{ error: any }>()
);
