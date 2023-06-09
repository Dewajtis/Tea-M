import { Component, OnInit } from '@angular/core';
import { LogandregService } from '../services/logandreg.service';
import { Router } from '@angular/router'; 
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = "";
  password: string = "";
  servermessage: any;
  badData: boolean = false;
  isProblem: boolean = false;
  
  constructor(private logandreg: LogandregService, private auth:AuthService,
    private route: Router) { }

  ngOnInit(): void {

  }

  onSubmit() { 
    this.logandreg.loginuser(this.username, this.password).subscribe((data) => {
          this.servermessage = data.message;
          if (this.servermessage == "login") {
            this.auth.setId(data.id);
            this.route.navigate(['/home', data.id]);
          }
          if (this.servermessage == "unable") {
            this.isProblem = true;
            this.badData = false;
          }
          if (this.servermessage == "baddata") {
            this.auth.resetId();
            this.isProblem = false;
            this.badData = true;
          }
          });
  }

} 
