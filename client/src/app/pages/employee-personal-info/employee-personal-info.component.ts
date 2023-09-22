import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoggedInUser } from 'src/app/store/actions/user.actions';
import { selectUser } from 'src/app/store/selectors/user.selectors';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

interface ApiResponse {
  data: any; // replace any with the type of data if known
}

@Component({
  selector: 'app-employee-personal-info',
  templateUrl: './employee-personal-info.component.html',
  styleUrls: ['./employee-personal-info.component.sass'],
})
export class EmployeePersonalInfoComponent implements OnInit {
  user!: LoggedInUser | null;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public diolog: MatDialog,
    private store: Store
  ) {}
  get_url: string = '/api/info/getInfo';
  submit_url: string = '/api/info/updateInfo';

  employee_data: any;
  status!: string;
  filePhase!: string;
  ProfilePictureFileUrl!: string;
  DriverLicenseFileUrl!: string;
  OPTReceiptFileName!: string;
  EADFileName!: string;
  I983FileName!: string;
  I20FileName!: string;
  isReadonly = true;
  isDisabled!: boolean;
  updatingValidityimmigration!: boolean;
  personalInfoForm: FormGroup = this.fb.group({
    name: this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      mname: [''],
      pname: [''],
    }),
    pic: ['default-profile.jpg'], // This should be a URL to the default image
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
    email: [
      this.user?.email, // need to set from api call =================================================>
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
      // opt_doc
      ead: [''],
      i983: [''],
      i20: [''],
      visatitle: [''],
      start: [''],
      end: [''],
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

  ngOnInit(): void {
    this.store.select(selectUser).subscribe((user) => {
      this.user = user;
    });
    this.http.get<ApiResponse>(this.get_url).subscribe({
      next: (response) => {

        this.employee_data = this.cleanRevData(response.data);
        this.status = this.employee_data.visa_status;
        this.filePhase = this.employee_data.next_file;

        this.setPersonalInfoForm(this.employee_data);

        this.personalInfoForm
          .get('immigration.isCitizenOrPr')
          ?.valueChanges.subscribe((result) => {
            if (result === 'true') {
              this.personalInfoForm
                .get('immigration.citizen_status')
                ?.setValidators([Validators.required]);
              this.personalInfoForm.get('immigration.type')?.clearValidators();
            } else if (result === 'false') {
              this.personalInfoForm
                .get('immigration.citizen_status')
                ?.clearValidators();
              this.personalInfoForm
                .get('immigration.type')
                ?.setValidators([Validators.required]);
            }
            if (!this.updatingValidityimmigration) {
              this.updatingValidityimmigration = true;

              this.personalInfoForm
                .get('immigration.type')
                ?.updateValueAndValidity();
              this.personalInfoForm
                .get('immigration.citizen_status')
                ?.updateValueAndValidity();

              this.updatingValidityimmigration = false;
            }
          });
        if (
          this.employee_data.pic !==
          'https://hr-project-bucket123450.s3.amazonaws.com/default_pic/Unknown.jpeg'
        ) {
          this.ProfilePictureFileUrl = 'Uploaded Profile Picture'; //default url //after uploaded becomes file name
        }
        if (this.employee_data.license.dl_doc !== 'Upload License') {
          this.DriverLicenseFileUrl = "Uploaded Driver's License"; //after uploaded becomes file name
        }


        if ((this.status === 'pending' || this.status === 'rejected') && this.filePhase === 'receipt') {
          this.OPTReceiptFileName = 'Uploaded Receipt';
        } else if (this.status === 'waiting' && this.filePhase === 'EAD') {
          this.OPTReceiptFileName = 'Uploaded Receipt';
        } else if ((this.status === 'pending' || this.status === 'rejected') && this.filePhase === 'EAD') {
          this.OPTReceiptFileName = 'Uploaded Receipt';
          this.EADFileName = 'Uploaded EAD file';
        } else if (this.status === 'waiting' && this.filePhase === 'I-983') {
          this.OPTReceiptFileName = 'Uploaded Receipt';
          this.EADFileName = 'Uploaded EAD file';
        } else if ((this.status === 'pending' || this.status === 'rejected') && this.filePhase === 'I-983') {
          this.OPTReceiptFileName = 'Uploaded Receipt';
          this.EADFileName = 'Uploaded EAD file';
          this.I983FileName = 'Uploaded I-983 file';
        } else if (this.status === 'waiting' && this.filePhase === 'I-20') {
          this.OPTReceiptFileName = 'Uploaded Receipt';
          this.EADFileName = 'Uploaded EAD file';
          this.I983FileName = 'Uploaded I-983 file';
        } else if ((this.status === 'pending' || this.status === 'rejected') && this.filePhase === 'I-20') {
          this.OPTReceiptFileName = 'Uploaded Receipt';
          this.EADFileName = 'Uploaded EAD file';
          this.I983FileName = 'Uploaded I-983 file';
          this.I20FileName = 'Uploaded I-20 file';
        } else if (this.status === 'approved') {
          this.OPTReceiptFileName = 'Uploaded Receipt';
          this.EADFileName = 'Uploaded EAD file';
          this.I983FileName = 'Uploaded I-983 file';
          this.I20FileName = 'Uploaded I-20 file';
          
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  setPersonalInfoForm(data: any) {
    this.personalInfoForm = this.fb.group({
      name: this.fb.group({
        fname: [data.name.fname, Validators.required],
        lname: [data.name.lname, Validators.required],
        mname: [data.name.mname],
        pname: [data.name.pname],
      }),
      pic: [data.pic],
      address: this.fb.group({
        apt: [data.address.apt],
        street: [data.address.street, Validators.required],
        city: [data.address.city, Validators.required],
        state: [data.address.state, Validators.required],
        zip: [
          data.address.zip,
          [Validators.required, Validators.pattern('^[0-9]{5}$')],
        ],
      }),
      phones: this.fb.group({
        cell_phone: [
          data.phones.cell_phone,
          [Validators.required, Validators.pattern('^[0-9]{10}$')],
        ],
        work_phone: [data.phones.work_phone, Validators.pattern('^[0-9]{10}$')],
      }),

      email: [data.email, Validators.required],
      social: this.fb.group({
        ssn: [
          data.social.ssn,
          [Validators.required, Validators.pattern('^[0-9]{9}$')],
        ],
        dob: [new Date(data.social.dob), Validators.required],
        gen: [data.social.gen],
      }),
      immigration: this.fb.group({
        isCitizenOrPr: [data.immigration.isCitizenOrPr, Validators.required], // are you a citizen or pr
        citizen_status: [data.immigration.citizen_status], //greencard or citizen
        type: [data.immigration.type], //visa type
        // opt_doc
        receipt: [''],
        visa_title: [''],
        start: [new Date(data.immigration.start)],
        end: [new Date(data.immigration.end)],
      }),

      emergency: this.fb.array(
        data.emergency.map((contact: any) =>
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
  }
  formData = new FormData();

  addEmergencyContact() {
    const emergencyContacts = this.personalInfoForm.get(
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
    return this.personalInfoForm.get('emergency') as FormArray;
  }
  invalidform: boolean = false;
  onSubmit() {
    if (this.personalInfoForm.valid) {
      this.invalidform = false;
      let cleandata = this.cleanSendData(this.personalInfoForm.getRawValue());

      const jsonBlob = new Blob([JSON.stringify(cleandata)], {
        type: 'application/json',
      });
      const jsonDataAsFile = new File([jsonBlob], 'data.json', {
        type: 'application/json',
      });
      this.formData.append('updatedData', jsonDataAsFile);
      this.http.put(this.submit_url, this.formData).subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
      );
      // this.personalInfoForm.reset();
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      this.invalidform = true;
      console.error('Form is invalid');
    }
  }

  openDialog() {
    const dialogRef = this.diolog.open(DialogElement);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'discard') {
        // reset form
        this.setPersonalInfoForm(this.employee_data);
      }
      this.isEdit = false;
    });
  }
  // this is to control the dialog pop window
  isEdit = false;
  onEdit() {
    this.isEdit = true;
  }
  downloadFile(filename: string) {
    this.http
      .get(
        `/api/info/download?fileName=${filename}&targetUserEmail=${this.employee_data?.email}`,
        {
          responseType: 'json',
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .subscribe({
        next: (response: any) => {
          if (response.mimeType.startsWith('image/')) {
            // For images, create a link element and simulate a click
            const link = document.createElement('a');
            link.href = response.file;
            link.download = response.filename;
            link.click();
          }
        },
        error: (err) => {
          if (err.name === 'HttpErrorResponse') {
            this.http
              .get(
                `/api/info/download?fileName=${filename}&targetUserEmail=${this.employee_data?.email}`,
                {
                  responseType: 'blob',
                  headers: { 'Content-Type': 'application/json' },
                }
              )
              .subscribe((blob: Blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename; // or use response.filename if available
                link.click();
              });
          }
        },
      });
  }
  previewFile(filename: string) {
    this.http
      .get(
        `/api/info/download?fileName=${filename}&targetUserEmail=${this.employee_data?.email}`,
        {
          responseType: 'json',
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .subscribe({
        next: (response: any) => {

          if (response.mimeType.startsWith('image/')) {
            // For images, we just use the base64 string directly
            const img = document.createElement('img');

            // Set its src to the base64 string
            img.src = response.file;

            // Optionally set some style attributes
            img.style.display = 'block';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';

            // Create a new window or tab
            const win = window.open('', '_blank');

            // Make sure the window was successfully opened
            if (win) {
              // Write the img element to the new window
              win.document.write(img.outerHTML);

              // You can also set the title of the new window
              win.document.title = response.filename;
            }
          }
        },
        error: (err) => {
          if (err.name === 'HttpErrorResponse') {
            this.http
              .get(
                `/api/info/download?fileName=${filename}&targetUserEmail=${this.employee_data?.email}`,
                {
                  responseType: 'blob',
                  headers: { 'Content-Type': 'application/json' },
                }
              )
              .subscribe((blob: Blob) => {
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
              });
          }
        },
      });
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
      delete result.visa;
    }
    delete result['immigration'];

    // result['dl'] = result['license'];

    // delete result.dl.hasLicense;
    // delete result.license;

    // result.car = result.carInfo;
    // delete result.carInfo;
    // delete result.car.hasCar;

    // delete result.ref.hasRef;

    if (!result.emergency[0].email) {
      delete result.emergency;
    }
    if (!result.ref.email) {
      delete result.ref;
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
    // if (reverseResult.car) {
    //   reverseResult['carInfo'] = {
    //     ...reverseResult['car'],
    //     hasCar: reverseResult.car.make ? 'true' : 'false',
    //   };
    // } else {
    //   reverseResult['carInfo'] = {
    //     hasCar: 'false', //no car
    //     // make: '',
    //     // model: '',
    //     // color: '',
    //   };
    // }

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
    // if (reverseResult.ref) {
    //   reverseResult['ref'] = {
    //     ...reverseResult.ref,
    //     hasRef: reverseResult.ref.fname ? 'true' : 'false',
    //   };
    // }
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

// this is the dialog window
@Component({
  selector: 'dialog-element',
  templateUrl: 'dialog-element.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogElement {
  constructor(public dialogRef: MatDialogRef<DialogElement>) {}
  onCancel(): void {
    this.dialogRef.close('discard');
  }
}
