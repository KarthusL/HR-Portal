import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface ErrorCodes {
  [key: string]: {
    title: string,
    description: string,
    img: string
  };
};

const errCodes: ErrorCodes = {
  400:{
    title: 'Bad Request',
    description: 'please log in again',
    img: 'https://www.shutterstock.com/image-vector/website-error-400-bad-request-600w-571762606.jpg'
  },
  401:{
    title: 'Unauthorized',
    description: 'Token has expired, please log in again',
    img: 'https://www.shutterstock.com/image-illustration/number-401-on-yellow-pink-600w-1101355769.jpg'
  },
  403:{
    title: 'Forbidden',
    description: 'You do not have access to the requested resource',
    img: 'https://www.shutterstock.com/image-illustration/number-403-on-yellow-pink-600w-1101368471.jpg'
  },
  404:{
    title: 'Not Found',
    description: 'The page you\'re looking for doesn\'t exist.',
    img: 'https://www.shutterstock.com/image-illustration/number-404-on-yellow-pink-600w-1100969576.jpg'
  },
  // 500: 'Internal Service Error',
  // 503: 'Service Unavailable',
}

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.sass']
})
export class ErrorPageComponent implements OnInit {
  errorCode!: string;
  errorObj!: {
    title: string,
    description: string,
    img: string
  }

  constructor (private route: ActivatedRoute) {};

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.errorCode = params['errorCode'];
      this.errorObj = errCodes[this.errorCode];
    });
  }
}
