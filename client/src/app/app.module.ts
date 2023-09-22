import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { AppRoutingModule } from './app-routing.module';
import { TokenInterceptor } from './injectables/tokenInterceptor/token.interceptor';
import { AppComponent } from './app.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { LogInPageComponent } from './pages/log-in-page/log-in-page.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { EmployeeApplicationComponent } from './pages/employee-application/employee-application.component';
import { HrPageComponent } from './pages/hr-page/hr-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';

import { EmployeeProfilesComponent } from './pages/hr-page/employee-profiles/employee-profiles.component';
import { VisaStatusManagementComponent } from './pages/hr-page/visa-status-management/visa-status-management.component';
import { HiringManagementComponent } from './pages/hr-page/hiring-management/hiring-management.component';
import { TopNavComponent } from './pages/hr-page/top-nav/top-nav.component';
import { EmployeeDetailComponent } from './pages/hr-page/employee-detail/employee-detail.component';
import { EmailRegistrationHistoryComponent } from './pages/hr-page/email-registration-history/email-registration-history.component';
import { RegistrationTokenComponent } from './pages/hr-page/hiring-management/components/registration-token/registration-token.component';
import { OnboardingApplicationReviewComponent } from './pages/hr-page/hiring-management/components/onboarding-application-review/onboarding-application-review.component';
import { OnboardingViewApplicationFormComponent } from './pages/hr-page/hiring-management/components/onboarding-view-application-form/onboarding-view-application-form.component';
import { VisaManageInprogressComponent } from './pages/hr-page/visa-status-management/components/visa-manage-inprogress/visa-manage-inprogress.component';
import { VisaManageAllComponent } from './pages/hr-page/visa-status-management/components/visa-manage-all/visa-manage-all.component';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { EmployeepageheaderComponent } from './components/employeepageheader/employeepageheader.component';


import { HrHousingPageComponent } from './pages/hr-housing-page/hr-housing-page.component';
import { HousingListComponent } from './components/housing-list/housing-list.component';
import { HousingDisplayComponent } from './components/housing-display/housing-display.component';
import { StoreModule } from '@ngrx/store';
import { housingReducer } from './store/reducers/hr-housing.reducers';
import { HrFaciltyReportCardComponent } from './components/hr-facilty-report-card/hr-facilty-report-card.component';
import { AddHousingFormComponent } from './components/add-housing-form/add-housing-form.component';
import { EmployeeHousingPageComponent } from './pages/employee-housing-page/employee-housing-page.component';
import { EmployeePersonalInfoComponent } from './pages/employee-personal-info/employee-personal-info.component';
import { MatDialogModule } from "@angular/material/dialog";
import { EmployeeVisamgmPageComponent } from './pages/employee-visamgm-page/employee-visamgm-page.component';
import { userReducer } from './store/reducers/user.reducers';
import { HrMainPageComponent } from './pages/hr-main-page/hr-main-page.component';
import { EmployeeDetailCardComponent } from './pages/hr-page/employee-detail-card/employee-detail-card.component';
import { EmployeePageComponent } from './pages/employee-page/employee-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
    LogInPageComponent,
    RegisterComponent,
    EmployeeApplicationComponent,
    HrPageComponent,
    EmployeeProfilesComponent,
    VisaStatusManagementComponent,
    HiringManagementComponent,
    TopNavComponent,
    EmployeeDetailComponent,
    EmailRegistrationHistoryComponent,
    RegistrationTokenComponent,
    OnboardingApplicationReviewComponent,
    OnboardingViewApplicationFormComponent,
    VisaManageInprogressComponent,
    VisaManageAllComponent,
    EmployeepageheaderComponent,
    HrHousingPageComponent,
    HousingListComponent,
    HousingDisplayComponent,
    HrFaciltyReportCardComponent,
    AddHousingFormComponent,
    EmployeeHousingPageComponent,
    EmployeePersonalInfoComponent,
    HrMainPageComponent,
    EmployeeDetailCardComponent,
    EmployeeVisamgmPageComponent,
    EmployeePageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    FlexLayoutModule,
    PdfViewerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatListModule,
    MatDialogModule,
    StoreModule.forRoot({ housing: housingReducer, user: userReducer }),
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
