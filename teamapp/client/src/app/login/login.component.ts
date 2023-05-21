import { Component, OnInit } from '@angular/core';
import { LogandregService } from '../services/logandreg.service'; 
import { Inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export class LogInf{
  constructor(public username: string,
              public password: string)
  {}
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = "";
  password: string = "";
  servermessage: any;
  userinf: any[] = [];
  userrole: string = "";
  isLogIn: boolean = false;
  badData: boolean = false;
  isProblem: boolean = false;
  
  constructor(private logandreg: LogandregService, private auth:AuthService) { }

  ngOnInit(): void {

  }

  onSubmit() { 
    this.logandreg.loginuser(new LogInf(this.username, 
      this.password)).subscribe((data) => {
          this.servermessage = data.message;
          this.userinf = data.userinf;
          if (this.servermessage == "login") {
            this.auth.setId(this.userinf[0]._id);
            this.isLogIn = true;
            this.isProblem = false;
            this.badData = false;
            this.userrole = this.userinf[0].role;
          }
          if (this.servermessage == "unable") {
            this.isLogIn = false;
            this.isProblem = true;
            this.badData = false;
          }
          if (this.servermessage == "baddata") {
            this.auth.resetId();
            this.isLogIn = false;
            this.isProblem = false;
            this.badData = true;
          }
          });
  }

} 
