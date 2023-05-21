import { Component, OnInit } from '@angular/core';
import { LogandregService } from '../services/logandreg.service'; 

export class User{
  constructor(public email: string,
              public username: string,
              public role: string,
              public password: string)
  {}
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  role: string = "";
  email: string = "";
  username: string = "";
  password: string = "";
  servermessage: any;
  isRegistered: boolean = false;
  isProblem: boolean = false;
  notOriginalemail: boolean = false;
  notOriginalname: boolean = false;

  constructor(private logandreg: LogandregService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.logandreg.reguser(new User(this.email, this.username, 
this.role, this.password)).subscribe((data) => {
    this.servermessage = data.message;
    if (this.servermessage == "saved") {
      this.isRegistered = true;
      this.notOriginalemail = false;
      this.notOriginalname = false;
      this.isProblem = false;
      this.username = "";
      this.password = "";
      this.email = "";
    }
    if (this.servermessage == "bademail") {
      this.isRegistered = false;
      this.notOriginalemail = true;
      this.notOriginalname = false;
      this.isProblem = false;
    }
    if (this.servermessage == "badname") {
      this.isRegistered = false;
      this.notOriginalemail = false;
      this.notOriginalname = true;
      this.isProblem = false;
    }
    if (this.servermessage == "unable") {
      this.isRegistered = false;
      this.notOriginalemail = false;
      this.notOriginalname = false;
      this.isProblem = true;
    }
    });
  }

}
