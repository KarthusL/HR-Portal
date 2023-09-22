export interface Employee {
  uname: string; //require unique
  email: string; //unique identifier
  psw: string;
  role: 'normal' | 'hr';
}