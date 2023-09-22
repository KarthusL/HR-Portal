import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { LogInPageComponent } from './pages/log-in-page/log-in-page.component';
import { EmployeeHousingPageComponent } from './pages/employee-housing-page/employee-housing-page.component';
import { EmployeeApplicationComponent } from './pages/employee-application/employee-application.component';
import { HrPageComponent } from './pages/hr-page/hr-page.component';
import { HrHousingPageComponent } from './pages/hr-housing-page/hr-housing-page.component';
import { EmployeeProfilesComponent } from './pages/hr-page/employee-profiles/employee-profiles.component';
import { EmployeeDetailComponent } from './pages/hr-page/employee-detail/employee-detail.component';
import { VisaStatusManagementComponent } from './pages/hr-page/visa-status-management/visa-status-management.component';
import { HiringManagementComponent } from './pages/hr-page/hiring-management/hiring-management.component';
import { EmailRegistrationHistoryComponent } from './pages/hr-page/email-registration-history/email-registration-history.component';
import { ErrorService } from './services/error-service.service';
import { AuthGuard } from './injectables/authGuard/auth.guard';
import { HrMainPageComponent } from './pages/hr-main-page/hr-main-page.component';
import { EmployeePersonalInfoComponent } from './pages/employee-personal-info/employee-personal-info.component';
import { EmployeeVisamgmPageComponent } from './pages/employee-visamgm-page/employee-visamgm-page.component';
import { EmployeepageheaderComponent } from './components/employeepageheader/employeepageheader.component';
import { EmployeePageComponent } from './pages/employee-page/employee-page.component';
import { EmployeeprotectService } from './injectables/employeeprotect/employeeprotect.service';

const routes: Routes = [
  { path: '', component: LogInPageComponent },
  {
    path: 'employee',
    component: EmployeePageComponent, // need to inject some service to tell if the application is approved or not to direct page view==================================>
    canActivate: [AuthGuard],
    children: [
      { path: '', component: EmployeeApplicationComponent },
      {
        path: 'info',
        component: EmployeePersonalInfoComponent,
        canActivate: [EmployeeprotectService],
      },
      {
        path: 'visa',
        component: EmployeeVisamgmPageComponent,
        canActivate: [EmployeeprotectService],
      },
      {
        path: 'housing',
        component: EmployeeHousingPageComponent,
        canActivate: [EmployeeprotectService],
      },
    ],
  },
  {
    path: 'hr',
    component: HrMainPageComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HrPageComponent },
      { path: 'employee-profiles', component: EmployeeProfilesComponent },
      { path: 'employee-profiles/:email', component: EmployeeDetailComponent },
      {
        path: 'visa-status-management',
        component: VisaStatusManagementComponent,
      },
      {
        path: 'email-registration-history',
        component: EmailRegistrationHistoryComponent,
      },
      { path: 'hiring-management', component: HiringManagementComponent },
      { path: 'housing', component: HrHousingPageComponent },
    ],
  },

  // please put all paths above the catch all path
  { path: 'error/:errorCode', component: ErrorPageComponent },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ErrorService, AuthGuard],
})
export class AppRoutingModule {}
