export interface LoginPayload { 
    email: string;
    password: string;
}

export interface LoginResponse{
    status: number;
    message: string;
    token: string;
}

export interface RegisterPayload extends LoginPayload{ 
    username: string;
}

export interface RegisterResponse extends LoginResponse{ 
}

