import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CompanysManagementComponent } from './companys-management/companys-management.component';
import { UsersManagementComponent } from './users-management/users-management.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { AddUserComponent } from './add-user/add-user.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'companys-management', component: CompanysManagementComponent},
  {path: 'users-management', component: UsersManagementComponent},
  {path: 'add-company', component: AddCompanyComponent},
  {path: 'add-user', component: AddUserComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperadminRoutingModule { }
