export interface LoginPayload { 
    email: string;
    password: string;
}

export interface LoginResponse{
    status: number;
    message: string;
    token: string;
    userId: number;
}

export interface RegisterPayload extends LoginPayload{ 
    username: string;
}

export interface RegisterResponse extends LoginResponse{ 
}

export interface ResponseIdentity<T> {
    data: T;
    status: number;
    message: string | null;
}

export interface ChatMessage {
    data: string;
    message: string;
    status: number;
}