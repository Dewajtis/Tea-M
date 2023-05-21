import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export class User{
  constructor(public email: string,
              public username: string,
              public role: string,
              public password: string)
  { }
 }
export class LogInf{
  constructor(public username: string,
              public password: string)
  {}
}

@Injectable({
  providedIn: 'root'
})
export class LogandregService {

  private logurl = "http://localhost:3000/login";
  private regurl = "http://localhost:3000/signup";

  constructor(private htt: HttpClient) { }

  loginuser(login: LogInf): Observable<any> {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.htt.post(this.logurl, JSON.stringify(login), {headers: myHeaders});
  }
  reguser(user: User): Observable<any> {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.htt.post(this.regurl, JSON.stringify(user), {headers: myHeaders});
  }
} 
