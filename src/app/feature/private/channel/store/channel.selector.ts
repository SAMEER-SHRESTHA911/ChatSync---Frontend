import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChannelState } from './channel.reducer';

export const selectChannelState = createFeatureSelector<ChannelState>('channel');

export const selectAllRooms = createSelector(
    selectChannelState,
    state => state.rooms
);

export const selectChannelLoading = createSelector(
    selectChannelState,
    state => state.loading
);

export const selectChannelError = createSelector(
    selectChannelState,
    state => state.error
);
