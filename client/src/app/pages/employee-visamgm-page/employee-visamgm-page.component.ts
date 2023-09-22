import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface ApiResponse {
  data: any; // replace any with the type of data if known
}

@Component({
  selector: 'app-employee-visamgm-page',
  templateUrl: './employee-visamgm-page.component.html',
  styleUrls: ['./employee-visamgm-page.component.sass'],
})
export class EmployeeVisamgmPageComponent implements OnInit {
  constructor(private http: HttpClient) {}
  get_url: string = '/api/info/getInfo';
  submit_url: string = '/api/info/upload';
  employee_data: any;
  status!: string;
  filePhase!: string;
  Rejected!: boolean;
  Approved!: boolean;
  invalid: boolean = false;
  EADFileName!:string;
  I983FileName!:string;
  I20FileName!:string;

  ngOnInit(): void {
    //api call
    this.http.get<ApiResponse>(this.get_url).subscribe({
      next: (response) => {
        let result = response;
        this.employee_data = this.cleanRevData(response.data);
        this.status = this.employee_data.visa_status;
        this.filePhase = this.employee_data.next_file;
        this.Rejected = this.status === 'rejected';
        this.Approved = this.status === 'approved';
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  // submitted = false;
  formData = new FormData();
  onEADSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.EADFileName = file.name;
      this.formData.append('files', file, 'EAD');
    }
  }
  onI983Selected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.I983FileName = file.name;
      this.formData.append('files', file, 'I-983');
    }
  }
  onI20Selected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.I20FileName = file.name;
      this.formData.append('files', file, 'I-20');
    }
  }

  onSubmit() {
    if (this.formData.has('files')) {
      this.http.post(this.submit_url, this.formData).subscribe({
        next: (res) => console.log(res),
        error: (err) => console.log(err),
      });
    } else {
      this.invalid = true;
      console.error('Please include a file');
    }
    setTimeout(() => {
      location.reload();
    }, 500);
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
