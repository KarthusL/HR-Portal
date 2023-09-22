import { Address, Person } from "./shared.interface";

//visa related data struture

export interface OPT_DOC {
  status: 'pending' | 'approved' | 'rejected';
  doc: File;
  msg?: string;
}

export interface OPT_DOCS {
  receipt: OPT_DOC;
  ead?: OPT_DOC;
  i983?: OPT_DOC;
  i20?: OPT_DOC;
}

export interface Visa {
  type: 'H1-B' | 'L2' | 'F1(CPT/OPT)' | 'H4' | 'Other';
  opt_doc?: OPT_DOCS;
  start: Date;
  end: Date;
}

//car related data struture

export interface DL {
  number: number;
  exp: Date;
  dl_doc: File;
}

export interface Car {
  make: string;
  model: string;
  color: string;
}

//related person

export interface Refer_Person {
  email: string;
  relation: string;
}

//whole data strture

export interface Employee_Info {
  //unique identifier
  email: string;

  //account activate status
  status: 'Not Started' | 'Rejected' | 'Pending' | 'fulfilled';

  //personal Info
  pic?: File;
  fname: string;
  mname?: string;
  lname: string;
  pname?: string;
  gen?: 'male' | 'female' | "I don't wish to answer";
  ssn: string;
  dob: Date;

  //contact info
  cur_add: Address;
  cell_phone: number;
  work_phone: number;

  //immegrant status
  citizen_status?: 'Green Card' | 'Citizen';
  visa?: Visa;

  //transportation
  dl?: DL;
  car?: Car;

  //related person
  ref?: Refer_Person;
  emergency: Person;
}