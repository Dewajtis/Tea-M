import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  permittedId: string = "";

  setId(newid:string) {
    this.permittedId = newid;
  }
  resetId() {
    this.permittedId = "";
  }
  getId():string {
    return this.permittedId;
  }
  
  constructor() { }
}
