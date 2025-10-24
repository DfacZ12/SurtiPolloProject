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

export interface AccesTokenResponse{
  statusCode: number;
  body:{
    accessToken: string;
  },
  error?: string;
}
