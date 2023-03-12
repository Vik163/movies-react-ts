export interface IAuthorization {
  name: string;
  email: string;
  password?: string;
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  isActivated: boolean;
  activationLink: string;
}
