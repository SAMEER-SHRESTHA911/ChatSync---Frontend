export interface ChannelData { 
    name: string;
    id: number;
}

export interface ChannelListDatum {
    id: number;
    name: string;
    createdAt: string;
    createdBy: RoomCreatedBy;
}

export interface RoomCreatedBy { 
    id: number;
    username: string;
}

export interface CreateRoomPayload { 
    roomName: string;
}

export interface Channels { 
    name: string;
    id: number;
}