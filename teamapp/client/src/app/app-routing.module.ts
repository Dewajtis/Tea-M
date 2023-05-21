import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { RegisterComponent } from './register/register.component';
import { TeamleadComponent } from './teamlead/teamlead.component';
import { MemberComponent } from './member/member.component';
import { CustomerComponent } from './customer/customer.component';
import { HomeComponent } from './home/home.component';

import { AccesscontrolGuard } from './services/accesscontrol.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home/:userid', component: HomeComponent, canActivate:[AccesscontrolGuard]},
  {path: 'teamleadboard/:userid/:projectid', component: TeamleadComponent, canActivate:[AccesscontrolGuard]},
  {path: 'memberboard/:userid/:projectid', component: MemberComponent, canActivate:[AccesscontrolGuard]},
  {path: 'customerboard/:userid/:projectid', component: CustomerComponent, canActivate:[AccesscontrolGuard]},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', component: NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
