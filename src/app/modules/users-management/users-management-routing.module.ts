import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AuthGuard } from '../../data/auth/auth.guard';

const routes: Routes = [
  {path: '', component: ManageUsersComponent},
  {path: 'add-user', component: AddUserComponent, canActivate: [AuthGuard], data: { roles: ['admin']}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersManagementRoutingModule { }
