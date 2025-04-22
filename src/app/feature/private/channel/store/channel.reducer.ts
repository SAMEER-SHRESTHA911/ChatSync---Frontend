import { createReducer, on } from '@ngrx/store';
import * as ChannelActions from './channel.actions';
import { ChannelListDatum } from '../models/channel.interface';

export interface ChannelState {
    rooms: ChannelListDatum[];
    loading: boolean;
    error: any;
}

export const initialState: ChannelState = {
    rooms: [],
    loading: false,
    error: null,
};

export const channelReducer = createReducer(
    initialState,

    on(ChannelActions.loadRooms, state => ({
        ...state,
        loading: true,
        error: null
    })),
    on(ChannelActions.loadRoomsSuccess, (state, { data }) => ({
        ...state,
        rooms: data.data,
        loading: false
    })),
    on(ChannelActions.loadRoomsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(ChannelActions.createRoom, state => ({
        ...state,
        loading: true,
        error: null
    })),
    on(ChannelActions.createRoomSuccess, (state, { data }) => ({
        ...state,
        rooms: [...state.rooms, data.data],
        loading: false
    })),
    on(ChannelActions.createRoomFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(ChannelActions.joinLeaveRoom, state => ({
        ...state,
        loading: true,
        error: null
    })),
    on(ChannelActions.joinLeaveRoomSuccess, state => ({
        ...state,
        loading: false
    })),
    on(ChannelActions.joinLeaveRoomFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))
);
