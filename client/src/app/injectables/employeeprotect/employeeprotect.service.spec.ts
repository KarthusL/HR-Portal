import { TestBed } from '@angular/core/testing';

import { EmployeeprotectService } from './employeeprotect.service';

describe('EmployeeprotectService', () => {
  let service: EmployeeprotectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeprotectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
