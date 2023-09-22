import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHousingFormComponent } from './add-housing-form.component';

describe('AddHousingFormComponent', () => {
  let component: AddHousingFormComponent;
  let fixture: ComponentFixture<AddHousingFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddHousingFormComponent]
    });
    fixture = TestBed.createComponent(AddHousingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
