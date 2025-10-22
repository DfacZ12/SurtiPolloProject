export interface AuthResponse{
  body:{
    user:string;
    accessToken:string;
    refreshToken:string;
  }
}

export interface AuthResponseError{
  body:{
    error: string;
  }
}

