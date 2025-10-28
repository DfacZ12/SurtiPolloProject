export interface AuthResponse{
  body:{
    infoUser:User;
    accessToken:string;
    refreshToken:string;
  }
}

export interface AuthResponseError{
  body:{
    error: string;
  }
}

export interface User{
  cc: number;
  username: string;
  name: string;
  cargo: string;
}

export interface AccesTokenResponse{
  statusCode: number;
  body:{
    accessToken: string;
  },
  error?: string;
}
