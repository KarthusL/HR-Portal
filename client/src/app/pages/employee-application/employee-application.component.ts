import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { LoggedInUser } from 'src/app/store/actions/user.actions';
import { selectUser } from 'src/app/store/selectors/user.selectors';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
  FormArray,
} from '@angular/forms';

type Status = 'Not Started' | 'Rejected' | 'Pending' | 'Approved';
interface ApiResponse {
  body: ResponseBody;
}

interface ResponseBody {
  data: any;
}


@Component({
  selector: 'app-employee-application',
  templateUrl: './employee-application.component.html',
  styleUrls: ['./employee-application.component.sass'],
})
export class EmployeeApplicationComponent implements OnInit {
  user!: LoggedInUser | null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private store: Store,
    private router: Router
  ) {} 
  applicationForm: FormGroup = this.fb.group({
    name: this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      mname: [''],
      pname: [''],
    }),
    pic: [
      'https://hr-project-bucket123450.s3.amazonaws.com/default_pic/Unknown.jpeg',
    ], 
    address: this.fb.group({
      apt: [''],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
    }),
    phones: this.fb.group({
      cell_phone: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      work_phone: ['', Validators.pattern('^[0-9]{10}$')],
    }),
    carInfo: this.fb.group({
      hasCar: [false],

      make: [''],
      model: [''],
      color: [''],
    }),
    email: [
      this.user?.email,
      Validators.required,
    ],
    social: this.fb.group({
      ssn: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      dob: ['', Validators.required],
      gen: [''],
    }),
    immigration: this.fb.group({
      isCitizenOrPr: ['', Validators.required], // are you a citizen or pr
      citizen_status: [''], //greencard or citizen
      type: [''], //visa type
      visa_title: [''],
      start: [''],
      end: [''],
    }),
    license: this.fb.group({
      hasLicense: ['', Validators.required],
      number: [''],
      exp: [''],
      dl_doc: ['Upload License'],
    }),
    ref: this.fb.group({
      hasRef: [''],
      fname: [''],
      lname: [''],
      mname: [''],
      phone: ['', Validators.pattern('^[0-9]{10}$')],
      email: ['', Validators.email],
      relationship: [''],
    }),
    emergency: this.fb.array([
      this.fb.group({
        fname: [''],
        lname: [''],
        mname: [''],
        phone: ['', Validators.pattern('^[0-9]{10}$')],
        email: ['', Validators.email],
        relationship: [''],
      }),
    ]),
  });

  get_url: string = '/api/info/getInfo';

  create_url: string = '/api/info/create_userInfo';

  update_url: string = '/api/info/updateInfo';
  submit_url!: string;
  status!: Status;
  employee_data: any;
  ProfilePictureFileUrl!: string;
  OPTReceiptFileName!: string;
  DriverLicenseFileUrl!: string;
  isReadonly = true;
  isDisabled!: boolean;
  updatingValidityimmigration!: boolean;
  updatingValiditylicense!: boolean;
  updatingValidityref!: boolean;
  ngOnInit(): void {
    this.store.select(selectUser).subscribe((user) => {
      this.user = user;
    });

    this.http
      .get<ResponseBody>(this.get_url, { observe: 'response' })
      .subscribe({
        next: (response) => {
          if (response.status !== 204) {
            // let result = response.body;

            this.status = response?.body?.data?.status;


            if (this.status === 'Pending' || this.status === 'Rejected') {
              this.employee_data = this.cleanRevData(response.body?.data);
              this.submit_url = this.update_url;
            } else if (this.status === 'Approved') {
              this.router.navigate(['/employee/info']); //=================================>> route to personalInfo
              return;
            }
            this.applicationForm = this.fb.group({
              name: this.fb.group({
                fname: [this.employee_data.name.fname, Validators.required],
                lname: [this.employee_data.name.lname, Validators.required],
                mname: [this.employee_data.name.mname],
                pname: [this.employee_data.name.pname],
              }),
              pic: [this.employee_data.pic], // This should be a URL to the default image
              address: this.fb.group({
                apt: [this.employee_data.address.apt],
                street: [
                  this.employee_data.address.street,
                  Validators.required,
                ],
                city: [this.employee_data.address.city, Validators.required],
                state: [this.employee_data.address.state, Validators.required],
                zip: [
                  this.employee_data.address.zip,
                  [Validators.required, Validators.pattern('^[0-9]{5}$')],
                ],
              }),
              phones: this.fb.group({
                cell_phone: [
                  this.employee_data.phones.cell_phone,
                  [Validators.required, Validators.pattern('^[0-9]{10}$')],
                ],
                work_phone: [
                  this.employee_data.phones.work_phone,
                  Validators.pattern('^[0-9]{10}$'),
                ],
              }),
              carInfo: this.fb.group({
                hasCar: [this.employee_data.carInfo.hasCar],

                make: [this.employee_data.carInfo.make],
                model: [this.employee_data.carInfo.model],
                color: [this.employee_data.carInfo.color],
              }),
              email: [
                this.employee_data.email, 
                Validators.required,
              ],
              social: this.fb.group({
                ssn: [
                  this.employee_data.social.ssn,
                  [Validators.required, Validators.pattern('^[0-9]{9}$')],
                ],
                dob: [
                  new Date(this.employee_data.social.dob),
                  Validators.required,
                ],
                gen: [this.employee_data.social.gen],
              }),
              immigration: this.fb.group({
                isCitizenOrPr: [
                  this.employee_data.immigration.isCitizenOrPr,
                  Validators.required,
                ], // are you a citizen or pr
                citizen_status: [this.employee_data.immigration.citizen_status], //greencard or citizen
                type: [this.employee_data.immigration.type], //visa type
                // opt_doc
                visa_title: [this.employee_data.immigration.visa_title],
                start: [new Date(this.employee_data.immigration.start)],
                end: [new Date(this.employee_data.immigration.end)],
              }),
              license: this.fb.group({
                hasLicense: [
                  this.employee_data.license.hasLicense,
                  Validators.required,
                ],
                number: [this.employee_data.license.number],
                exp: [new Date(this.employee_data.license.exp)],
                dl_doc: [this.employee_data.license.dl_doc],
              }),
              ref: this.fb.group({
                hasRef: [this.employee_data.ref?.hasRef],
                fname: [this.employee_data.ref?.fname],
                lname: [this.employee_data.ref?.lname],
                mname: [this.employee_data.ref?.mname],
                phone: [
                  this.employee_data.ref?.phone,
                  Validators.pattern('^[0-9]{10}$'),
                ],
                email: [this.employee_data.ref?.email, Validators.email],
                relationship: [this.employee_data.ref?.relationship],
              }),
              emergency: this.fb.array(
                
                this.employee_data.emergency.map((contact: any) =>
                  this.fb.group({
                    fname: [contact.fname],
                    lname: [contact.lname],
                    mname: [contact.mname],
                    phone: [contact.phone, Validators.pattern('^[0-9]{10}$')],
                    email: [contact.email, Validators.email],
                    relationship: [contact.relationship],
                  })
                )
              ),
            });

            this.applicationForm
              .get('immigration.isCitizenOrPr')
              ?.valueChanges.subscribe((result) => {
                if (result === 'true') {
                  this.applicationForm
                    .get('immigration.citizen_status')
                    ?.setValidators([Validators.required]);
                  this.applicationForm
                    .get('immigration.type')
                    ?.clearValidators();
                } else if (result === 'false') {
                  this.applicationForm
                    .get('immigration.citizen_status')
                    ?.clearValidators();
                  this.applicationForm
                    .get('immigration.type')
                    ?.setValidators([Validators.required]);
                }
                if (!this.updatingValidityimmigration) {
                  this.updatingValidityimmigration = true;

                  this.applicationForm
                    .get('immigration.type')
                    ?.updateValueAndValidity();
                  this.applicationForm
                    .get('immigration.citizen_status')
                    ?.updateValueAndValidity();

                  this.updatingValidityimmigration = false;
                }
              });
            this.applicationForm
              .get('license.hasLicense')
              ?.valueChanges.subscribe((result) => {
                if (result === 'true') {
                  this.applicationForm
                    .get('license.number')
                    ?.setValidators([Validators.required]);
                  this.applicationForm
                    .get('license.exp')
                    ?.setValidators([Validators.required]);
                  this.applicationForm
                    .get('license.dl_doc')
                    ?.setValidators([
                      Validators.required,
                      Validators.pattern('^(?!Upload License$).*$'),
                    ]);
                } else if (result === 'false') {
                  this.applicationForm.get('license.number')?.clearValidators();
                  this.applicationForm.get('license.exp')?.clearValidators();
                  this.applicationForm.get('license.dl_doc')?.clearValidators();
                }
                if (!this.updatingValiditylicense) {
                  this.updatingValiditylicense = true;

                  this.applicationForm
                    .get('license.number')
                    ?.updateValueAndValidity();
                  this.applicationForm
                    .get('license.exp')
                    ?.updateValueAndValidity();
                  this.applicationForm
                    .get('license.dl_doc')
                    ?.updateValueAndValidity();

                  this.updatingValiditylicense = false;
                }
              });
            if (this.employee_data.ref?.hasRef === 'true') {
              this.applicationForm
                .get('ref.fname')
                ?.setValidators([Validators.required]);
              this.applicationForm
                .get('ref.lname')
                ?.setValidators([Validators.required]);
              this.applicationForm
                .get('ref.phone')
                ?.setValidators([Validators.required]);
              this.applicationForm
                .get('ref.email')
                ?.setValidators([Validators.required]);
              this.applicationForm
                .get('ref.relationship')
                ?.setValidators([Validators.required]);
            }
            this.applicationForm
              .get('ref.hasRef')
              ?.valueChanges.subscribe((result) => {
                if (result === 'true') {
                  this.applicationForm
                    .get('ref.fname')
                    ?.setValidators([Validators.required]);
                  this.applicationForm
                    .get('ref.lname')
                    ?.setValidators([Validators.required]);
                  this.applicationForm
                    .get('ref.phone')
                    ?.setValidators([Validators.required]);
                  this.applicationForm
                    .get('ref.email')
                    ?.setValidators([Validators.required]);
                  this.applicationForm
                    .get('ref.relationship')
                    ?.setValidators([Validators.required]);
                } else if (result === 'false') {
                  this.applicationForm.get('ref.fname')?.clearValidators();
                  this.applicationForm.get('ref.lname')?.clearValidators();

                  this.applicationForm.get('ref.phone')?.clearValidators();

                  this.applicationForm.get('ref.email')?.clearValidators();

                  this.applicationForm
                    .get('ref.relationship')
                    ?.clearValidators();
                }
                if (!this.updatingValidityref) {
                  this.updatingValidityref = true;

                  this.applicationForm
                    .get('ref.fname')
                    ?.updateValueAndValidity();
                  this.applicationForm
                    .get('ref.lname')
                    ?.updateValueAndValidity();
                  this.applicationForm
                    .get('ref.phone')
                    ?.updateValueAndValidity();
                  this.applicationForm
                    .get('ref.email')
                    ?.updateValueAndValidity();
                  this.applicationForm
                    .get('ref.relationship')
                    ?.updateValueAndValidity();

                  this.updatingValidityref = false;
                }
              });

            if (this.status === 'Pending') {
              this.applicationForm.disable();
              
              this.isDisabled = true;
            }
            if (
              this.employee_data.pic !==
              'https://hr-project-bucket123450.s3.amazonaws.com/default_pic/Unknown.jpeg'
            ) {
              this.ProfilePictureFileUrl = this.employee_data.pic; //default url //after uploaded becomes file name
            }
            if (this.employee_data.license.dl_doc !== 'Upload License') {
              this.DriverLicenseFileUrl = "Uploaded driver's license"; //after uploaded becomes file name
            }
            if (this.employee_data.next_file === 'EAD') {
              this.OPTReceiptFileName = 'Uploaded Receipt';
            }
          } else {
            this.status = 'Not Started';
            this.submit_url = this.create_url;

            this.applicationForm.get('email')?.setValue(this.user?.email);
            this.applicationForm
              .get('immigration.isCitizenOrPr')
              ?.valueChanges.subscribe((result) => {
                if (result === 'true') {
                  this.applicationForm
                    .get('immigration.citizen_status')
                    ?.setValidators([Validators.required]);
                  this.applicationForm
                    .get('immigration.type')
                    ?.clearValidators();
                } else if (result === 'false') {
                  this.applicationForm
                    .get('immigration.citizen_status')
                    ?.clearValidators();
                  this.applicationForm
                    .get('immigration.type')
                    ?.setValidators([Validators.required]);
                }
                if (!this.updatingValidityimmigration) {
                  this.updatingValidityimmigration = true;

                  this.applicationForm
                    .get('immigration.type')
                    ?.updateValueAndValidity();
                  this.applicationForm
                    .get('immigration.citizen_status')
                    ?.updateValueAndValidity();

                  this.updatingValidityimmigration = false;
                }
              });
            this.applicationForm
              .get('license.hasLicense')
              ?.valueChanges.subscribe((result) => {
                if (result === 'true') {
                  this.applicationForm
                    .get('license.number')
                    ?.setValidators([Validators.required]);
                  this.applicationForm
                    .get('license.exp')
                    ?.setValidators([Validators.required]);
                  this.applicationForm
                    .get('license.dl_doc')
                    ?.setValidators([
                      Validators.required,
                      Validators.pattern('^(?!Upload License$).*$'),
                    ]);
                } else if (result === 'false') {
                  this.applicationForm.get('license.number')?.clearValidators();
                  this.applicationForm.get('license.exp')?.clearValidators();
                  this.applicationForm.get('license.dl_doc')?.clearValidators();
                }

                if (!this.updatingValiditylicense) {
                  this.updatingValiditylicense = true;

                  this.applicationForm
                    .get('license.number')
                    ?.updateValueAndValidity();
                  this.applicationForm
                    .get('license.exp')
                    ?.updateValueAndValidity();
                  this.applicationForm
                    .get('license.dl_doc')
                    ?.updateValueAndValidity();

                  this.updatingValiditylicense = false;
                }
              });
            this.applicationForm
              .get('ref.hasRef')
              ?.valueChanges.subscribe((result) => {
                if (result === 'true') {
                  this.applicationForm
                    .get('ref.fname')
                    ?.setValidators([Validators.required]);
                  this.applicationForm
                    .get('ref.lname')
                    ?.setValidators([Validators.required]);
                  this.applicationForm
                    .get('ref.phone')
                    ?.setValidators([Validators.required]);
                  this.applicationForm
                    .get('ref.email')
                    ?.setValidators([Validators.required]);
                  this.applicationForm
                    .get('ref.relationship')
                    ?.setValidators([Validators.required]);
                } else if (result === 'false') {
                  this.applicationForm.get('ref.fname')?.clearValidators();
                  this.applicationForm.get('ref.lname')?.clearValidators();

                  this.applicationForm.get('ref.phone')?.clearValidators();

                  this.applicationForm.get('ref.email')?.clearValidators();

                  this.applicationForm
                    .get('ref.relationship')
                    ?.clearValidators();
                }

                if (!this.updatingValidityref) {
                  this.updatingValidityref = true;

                  this.applicationForm
                    .get('ref.fname')
                    ?.updateValueAndValidity();
                  this.applicationForm
                    .get('ref.lname')
                    ?.updateValueAndValidity();
                  this.applicationForm
                    .get('ref.phone')
                    ?.updateValueAndValidity();
                  this.applicationForm
                    .get('ref.email')
                    ?.updateValueAndValidity();
                  this.applicationForm
                    .get('ref.relationship')
                    ?.updateValueAndValidity();

                  this.updatingValidityref = false;
                }
              });
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  formData = new FormData();
  onProfilePictureSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.ProfilePictureFileUrl = file.name; //after uploaded becomes file name
      if (this.status === 'Rejected') {
        this.formData.append('updatedData', file, 'profile');
      } else {
        this.formData.append('files', file, 'profile');
      }
    }
  }
  onOPTReceiptSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.OPTReceiptFileName = file.name;
      if ((this.status = 'Rejected')) {
        this.formData.append('updatedData', file, 'receipt');
      } else {
        this.formData.append('files', file, 'receipt');
      }
    }
  }
  onDriverLicenseSelected(event: any) {
    const file: File = event.target.files[0];
    // use a hidden input to validate driverlicense upload
    this.applicationForm.get('license.dl_doc')?.setValue(file ? file.name : '');
    if (file) {
      this.DriverLicenseFileUrl = file.name; //after uploaded becomes file name
      if (this.status === 'Rejected') {
        this.formData.append('updatedData', file, 'dl');
      } else {
        this.formData.append('files', file, 'dl');
      }
    }
  }
  addEmergencyContact() {
    const emergencyContacts = this.applicationForm.get(
      'emergency'
    ) as FormArray;
    emergencyContacts.push(
      this.fb.group({
        fname: [''],
        lname: [''],
        mname: [''],
        phone: [''],
        email: [''],
        relationship: [''],
      })
    );
  }
  getEmergencyContacts(): FormArray {
    return this.applicationForm.get('emergency') as FormArray;
  }
  invalidform: boolean = false;
  onSubmit() {

    if (this.applicationForm.valid) {
      this.invalidform = false;
      let cleandata = this.cleanSendData(this.applicationForm.getRawValue());
      const jsonBlob = new Blob([JSON.stringify(cleandata)], {
        type: 'application/json',
      });
      const jsonDataAsFile = new File([jsonBlob], 'data.json', {
        type: 'application/json',
      });
      if (this.status === 'Rejected') {
        this.formData.append('updatedData', jsonDataAsFile);
      } else {
        this.formData.append('json', jsonDataAsFile);
      }

      if (this.status === 'Rejected') {
        this.http.put(this.submit_url, this.formData).subscribe(
          (res) => console.log(res),
          (err) => console.log(err)
        );
      } else {
        this.http.post(this.submit_url, this.formData).subscribe(
          (res) => console.log(res),
          (err) => console.log(err)
        );
      }
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      this.invalidform = true;
     
      this.printError(this.applicationForm);
      console.error('Form is invalid');
    }
  }
  printError(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.printError(control);
      } else {
        const controlErrors: ValidationErrors | null | undefined =
          control?.errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach((keyError) => {
            console.log(
              'Key control: ' +
                key +
                ', keyError: ' +
                keyError +
                ', err value: ',
              controlErrors[keyError]
            );
          });
        }
      }
    });
  }

  checkFormValidity() {
    if (this.applicationForm.valid) {
      // Form is valid, process the form
    } else {
      // Form is not valid, check each control for errors
      this.printError(this.applicationForm);
    }
  }
  cleanSendData(formRawData: any) {
    let result = { ...formRawData };
    result = {
      ...result,
      ...result['name'],
      ...result['social'],
      ...result['phones'],
      citizen_status: result['immigration']['citizen_status'],
    };
    delete result['name'];
    delete result['social'];
    delete result['phones'];

    result.cell_phone = Number(result.cell_phone);
    result.work_phone = result.work_phone ? Number(result.work_phone) : null;

    result['cur_add'] = result['address'];
    result.cur_add.zip = Number(result.cur_add.zip);
    delete result['address'];
    
    result['visa'] = result['immigration'];
    delete result.visa.isCitizenOrPr;
    delete result.visa.citizen_status;
    if (!result.visa.type) {
      delete result.visa
    }
    delete result['immigration'];

    result['dl'] = result['license'];

    delete result.dl.hasLicense;
    if (!result.dl.number) {
      delete result.dl
    }
    delete result.license;

    result.car = result.carInfo;
    delete result.carInfo;
    delete result.car.hasCar;
    if (!result.car.make) {
      delete result.car
    }

    delete result.ref.hasRef;

    if (!result.emergency[0].email) {
      delete result.emergency
    }
    if (!result.ref.email) {
      delete result.ref
    }


    return result;
  }
  cleanRevData(resData: any) {
    let reverseResult = { ...resData };

    reverseResult['name'] = {
      fname: reverseResult.fname,
      mname: reverseResult.mname,
      lname: reverseResult.lname,
      pname: reverseResult.pname,
    };

    reverseResult['address'] = {
      ...reverseResult['cur_add'],
      zip: String(reverseResult.cur_add.zip),
    };

    reverseResult['phones'] = {
      cell_phone: String(reverseResult.cell_phone),
      work_phone: reverseResult.work_phone
        ? String(reverseResult.work_phone)
        : null,
    };
    if (reverseResult.car) {
      reverseResult['carInfo'] = {
        ...reverseResult['car'],
        hasCar: reverseResult.car.make ? 'true' : 'false',
      };
    } else {
      reverseResult['carInfo'] = {
        hasCar: 'false', //no car
        // make: '',
        // model: '',
        // color: '',
      };
    }

    reverseResult['social'] = {
      ssn: reverseResult.ssn,
      dob: reverseResult.dob,
      gen: reverseResult.gen,
    };

    reverseResult['immigration'] = {
      ...reverseResult['visa'],
      citizen_status: reverseResult.citizen_status,
      isCitizenOrPr:
        reverseResult.citizen_status === 'Other' ? 'false' : 'true',
      // type:
      //   reverseResult.citizen_status === 'Other' ? reverseResult.visa.type : '',
      // start:
      //   reverseResult.citizen_status === 'Other' ? reverseResult.visa.type : '',
      // end:
      //   reverseResult.citizen_status === 'Other' ? reverseResult.visa.type : '',
    };
    if (reverseResult.dl) {
      reverseResult['license'] = {
        ...reverseResult['dl'],
        hasLicense: reverseResult.dl.number ? 'true' : 'false',
      };
    } else {
      reverseResult['license'] = {
        hasLicense: 'false', // no car
        // number: '',
        // exp: '',
        dl_doc: 'Upload License',
      };
    }
    if (reverseResult.ref) {
      reverseResult['ref'] = {
        ...reverseResult.ref,
        hasRef: reverseResult.ref.fname ? 'true' : 'false',
      };
    }
    // else {
    //   reverseResult['ref'] = {
    //     hasRef: 'false',
    //     fname: '',
    //     lname: '',
    //     mname: '',
    //     phone: '',
    //     email: '',
    //     relationship: '',
    //   };
    // }

    // delete the flattened properties
    delete reverseResult.fname;
    delete reverseResult.mname;
    delete reverseResult.lname;
    delete reverseResult.pname;
    delete reverseResult.ssn;
    delete reverseResult.dob;
    delete reverseResult.gen;
    delete reverseResult.cell_phone;
    delete reverseResult.work_phone;
    delete reverseResult.citizen_status;
    delete reverseResult.cur_add;
    delete reverseResult.visa;
    delete reverseResult.dl;
    delete reverseResult.car;

    return reverseResult;
  }
}
