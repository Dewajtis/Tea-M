import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export class User{
  constructor(public email: string,
              public username: string,
              public role: string,
              public password: string)
  { }
 }

@Injectable({
  providedIn: 'root'
})
export class LogandregService {

  private logurl = "http://localhost:3000/login";
  private regurl = "http://localhost:3000/signup";

  constructor(private htt: HttpClient) { }

  loginuser(username:string, password:string): Observable<any> {
    let queryParams = new HttpParams().append("username",username).append("password",password);
    return this.htt.get<any>(this.logurl, {params: queryParams}); 
  }
  reguser(user: User): Observable<any> {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.htt.post(this.regurl, JSON.stringify(user), {headers: myHeaders});
  }
} 
