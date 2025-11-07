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
  lastname: string;
  role: string;
  rolId: number
}

export interface AccesTokenResponse{
  statusCode: number;
  body:{
    accessToken: string;
    refreshToken: string;
  },
  error?: string;
}
