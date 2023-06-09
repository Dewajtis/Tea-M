import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export class NewProject{
  constructor(public projectname: string,
              public teamlead: string,
              public email: string)
  {}
}
export class NewPeople{
  constructor(public projectid: string,
              public projectname: string,
              public user: string)
  {}
}
export class RemovePeople{
  constructor(public projectid: string,
              public username: string)
  {}
}
export class AddListInf{
  constructor(public projectid: string,
              public listname: string)
  {}
}
export class EditListInf{
  constructor(public projectid: string,
              public listid: string,
              public listname: string)
  {}
}
export class NewTask{
  constructor(public projectid: string,
              public listid: string,
              public taskname: string,
              public startdate: Date,
              public duedate: Date,
              public mainmember: string,
              public description: String)
  {}
}
export class UpdateTaskInf{
  constructor(public projectid: string,
              public taskid: string,
              public name: string,
              public startdate: Date,
              public duedate: Date,
              public mainmember: string,
              public description: string)
  {}
}
export class DeleteTask{
  constructor(public projectid: string,
              public taskid: string)
  {}
}
export class NewTaskStatus{
  constructor(public taskid: string,
              public projectid: string,
              public taskstatus: string,
              public taskpercent: number)
  {}
}
export class NewComment{
  constructor(public taskid: string,
              public name: string,
              public comment: string)
  {}
}
export class NewReccomendation{
  constructor(public taskid: string,
              public reccomendation: string)
  {}
}

@Injectable({
  providedIn: 'root'
})
export class WorkwhdataService {

  private getuserurl = "http://localhost:3000/getuser";
  private getprojecturl = "http://localhost:3000/getproject";
  private gettaskurl = "http://localhost:3000/gettask";

  private addnewprojecturl = "http://localhost:3000/addproject";

  private addcustomerurl = "http://localhost:3000/addcustomer";
  private removecustomerurl = "http://localhost:3000/removecustomer";

  private addmemberurl = "http://localhost:3000/addmember";
  private removememberurl = "http://localhost:3000/removemember";

  private addlisturl = "http://localhost:3000/addlist";
  private renamelisturl = "http://localhost:3000/renamelist";
  private removelisturl = "http://localhost:3000/removelist";

  private addtaskurl = "http://localhost:3000/addtask";
  private updatetaskinfurl = "http://localhost:3000/updatetaskinf";
  private updatetaskreccomendationurl = "http://localhost:3000/updatetaskreccomendation";
  private updatetaskstatusurl = "http://localhost:3000/updatetaskstatus";
  private addcommenturl = "http://localhost:3000/addcomment";
  private deletetaskurl = "http://localhost:3000/deletetask";

  private deleteprojecturl = "http://localhost:3000/deleteproject";

  constructor(private htt: HttpClient) {}

  getoneuserbyid(id: any): Observable<any> {
    let queryParams = new HttpParams().append("id",id);
    return this.htt.get<any>(this.getuserurl, {params: queryParams}); 
  }
  getoneprojectbyid(id: any): Observable<any> {
    let queryParams = new HttpParams().append("id",id);
    return this.htt.get<any>(this.getprojecturl, {params: queryParams}); 
  }
  getonetaskbyid(id: any): Observable<any> {
    let queryParams = new HttpParams().append("id",id);
    return this.htt.get<any>(this.gettaskurl, {params: queryParams}); 
  }

  addnewproject(project: NewProject): Observable<any> {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.htt.post(this.addnewprojecturl, JSON.stringify(project), {headers: myHeaders});
  }

  addcustomer(addcustomer: NewPeople): Observable<any> {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.htt.put(this.addcustomerurl, JSON.stringify(addcustomer), {headers: myHeaders});
  }
  removecustomer(removecustomer: RemovePeople): Observable<any> {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.htt.put(this.removecustomerurl, JSON.stringify(removecustomer), {headers: myHeaders});
  }

  addmember(addmember: NewPeople): Observable<any> {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.htt.put(this.addmemberurl, JSON.stringify(addmember), {headers: myHeaders});
  }
  removemember(removemember: RemovePeople): Observable<any> {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.htt.put(this.removememberurl, JSON.stringify(removemember), {headers: myHeaders});
  }

  addlist(listinf: AddListInf): Observable<any> {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.htt.put(this.addlisturl, JSON.stringify(listinf), {headers: myHeaders});
  }
  renamelist(listinf: EditListInf): Observable<any> {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.htt.put(this.renamelisturl, JSON.stringify(listinf), {headers: myHeaders});
  }
  removelist(listinf: AddListInf): Observable<any> {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.htt.put(this.removelisturl, JSON.stringify(listinf), {headers: myHeaders});
  }

  addtask(task: NewTask): Observable<any> {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.htt.post(this.addtaskurl, JSON.stringify(task), {headers: myHeaders});
  }
  updatetaskinf(newfields:UpdateTaskInf): Observable<any> {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.htt.put(this.updatetaskinfurl, JSON.stringify(newfields), {headers: myHeaders});
  }
  deletetask(taskid:string,projectid:string): Observable<any> {
    let queryParams = new HttpParams().append("taskid",taskid)
      .append("projectid",projectid);
    return this.htt.delete<any>(this.deletetaskurl, {params: queryParams}); 
  }
  updatetaskstatus(taskstatus:NewTaskStatus): Observable<any> {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.htt.put(this.updatetaskstatusurl, JSON.stringify(taskstatus), {headers: myHeaders});
  }
  addcomment(newcomment:NewComment): Observable<any> {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.htt.put(this.addcommenturl, JSON.stringify(newcomment), {headers: myHeaders});
  }
  updatetaskreccomendation(newtaskreccomendation:NewReccomendation): Observable<any> {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.htt.put(this.updatetaskreccomendationurl, JSON.stringify(newtaskreccomendation), {headers: myHeaders});
  }
  
  deleteproject(projectid:string): Observable<any> {
    let queryParams = new HttpParams().append("projectid",projectid);
    return this.htt.delete<any>(this.deleteprojecturl, {params: queryParams}); 
  }

}
