import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  permittedId: string|null = "";

  setId(newid:string) {
    this.permittedId = newid;
    localStorage.setItem('id',this.permittedId);
  }
  resetId() {
    this.permittedId = "";
    localStorage.setItem('id',this.permittedId);
  }
  getId():string|null {
    this.permittedId = localStorage.getItem('id');
    return this.permittedId;
  }
  
  constructor() { }
}
