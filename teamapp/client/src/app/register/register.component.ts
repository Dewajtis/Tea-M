import { Component, OnInit } from '@angular/core';
import { LogandregService } from '../services/logandreg.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
  isProblem: boolean = false;
  notOriginalemail: boolean = false;
  notOriginalname: boolean = false;

  constructor(private logandreg: LogandregService, private route: Router,
    private auth: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.logandreg.reguser(new User(this.email, this.username, 
this.role, this.password)).subscribe((data) => {
    this.servermessage = data.message;
    if (this.servermessage == "saved") {
      this.auth.setId(data.id);
      this.route.navigate(['/home', data.id]);
    }
    if (this.servermessage == "bademail") {
      this.notOriginalemail = true;
      this.notOriginalname = false;
      this.isProblem = false;
    }
    if (this.servermessage == "badname") {
      this.notOriginalemail = false;
      this.notOriginalname = true;
      this.isProblem = false;
    }
    if (this.servermessage == "unable") {
      this.notOriginalemail = false;
      this.notOriginalname = false;
      this.isProblem = true;
    }
    });
  }

}
