import { Injectable } from '@angular/core';
import { EmailJSResponseStatus, init, send } from 'emailjs-com';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private serviceId = 'service_8wl20s4';
  private templateId = 'template_u2147np';
  private userId = '';

  constructor(private http: HttpClient) {
    init(this.userId = 'm7QGoDPTQOTH41eUx');
  }

  async sendEmail(name: string, email: string, message: string): Promise<EmailJSResponseStatus> {
    try {
      const res: any = await firstValueFrom(this.http.post('http://localhost:3000/api/hr/hire', {email, name}, { observe: 'response' }));
      const registrationLink = res.body.registrationLink;
      const templateParams = {
        name,
        email,
        registrationLink
      };
      return send('service_8wl20s4', 'template_u2147np', templateParams);
    } catch (error) {
      console.error('Error fetching application link', error);
      throw error;
    }
  }

  sendNotification(fullName: string, email: string, nextFile: string): Promise<EmailJSResponseStatus> {
    try {
      const templateParams = {
        full_name: fullName,
        next_file: nextFile,
        email,
      };
      return send('service_8wl20s4', 'template_fq772um' , templateParams);
    } catch (error) {
      console.error('Error sending notification', error);
      throw error;
    }
  }
}
