import { Address, Person } from "./shared.interface";
import { Employee_Info } from "./employee.interface";

export interface Furniture {
  beds: number;
  mattresses: number;
  tables: number;
  chairs: number;
}

export interface Comment {
  desc: string;
  created_by: string; //can be email
  ts: Date;
}

export interface Fac_Report {
  title: string;
  desc: string;
  created_by: string; //can be email
  ts: Date;
  status: 'Open' | 'In Progress' | 'Closed';
  comments: Comment[];
}

export interface Housing {
  _id: string;
  address: Address;
  tenant: Employee_Info[]; //should be a list of emails(which related to employees)
  reports: Fac_Report[]; //hr can access all, normal user can access report created by itself

  //should only be visible to hr
  landlord?: Person;
  furniture?: Furniture;
}