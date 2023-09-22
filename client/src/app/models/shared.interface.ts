export interface Address {
  apt?: number;
  street: string;
  city: string;
  state: string;
  zip: number;
}

//person from outside
export interface Person {
  fname: string;
  lname: string;
  mname?: string;
  phone: number;
  email: string;
}