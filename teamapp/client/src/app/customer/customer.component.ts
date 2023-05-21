import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkwhdataService } from '../services/workwhdata.service';
import { DatePipe } from '@angular/common';

export class RemovePeople{
  constructor(public projectid: string,
              public username: string)
  {}
}
export class NewReccomendation{
  constructor(public taskid: string,
              public reccomendation: string)
  {}
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  USERISCUSTOMER: boolean = false;
  userInProject: boolean = true;

  userid: string = "";
  projectid: string = "";
  userinf: any[] = [];
  projectinf: any[] = [];

  worklistid: string = "";
  worktaskid: string = "";
  worktaskinf: any[] = [];

  taskreccomendation: string = "";
  editstartdateinf: any;
  editduedateinf: any;
  
  servermessage: string = "default";

  isUserPanel: boolean = true;
  isTeamPanel: boolean = false;
  isEditTaskPanel: boolean = false;
  
  constructor(private activateRoute: ActivatedRoute, private work: WorkwhdataService, private datepipe: DatePipe) {
    this.userid = activateRoute.snapshot.params['userid'];
    this.projectid = activateRoute.snapshot.params['projectid'];
   }

   ngOnInit(): void {
    this.work.getoneuserbyid(this.userid).subscribe(data0 => {
      this.userinf = data0;
    });
    this.work.getoneprojectbyid(this.projectid).subscribe(data => {
      this.projectinf = data;
      if(this.projectinf[0].customer.name==this.userinf[0].username) {
        this.USERISCUSTOMER = true;
      }
    });
  }
  
  openUserPanel(): void {
    this.isTeamPanel = false;
    this.isUserPanel = true;
  }
  openTeamPanel(): void {
    this.isUserPanel = false;
    this.isTeamPanel = true;
  }
  openEditTaskPanel(listid: string, taskid: string): void {
    this.worklistid = listid;
    this.worktaskid = taskid;
    this.work.getonetaskbyid(this.worktaskid).subscribe(data => {
      this.worktaskinf = data;
      this.taskreccomendation = this.worktaskinf[0].reccomendation;
      this.editstartdateinf = this.datepipe.transform(this.worktaskinf[0].startdate, 'dd-MM-yyyy');
      this.editduedateinf = this.datepipe.transform(this.worktaskinf[0].duedate, 'dd-MM-yyyy');
    });
    this.isEditTaskPanel = true;
  }
  closeEditTaskPanel(): void {
    this.isEditTaskPanel = false;
  }

  customerLeaveProject() {
    this.work.removecustomer(new RemovePeople(this.projectid,this.userinf[0].username)).subscribe((data) => {
      this.servermessage = data.message;
      if(this.servermessage=="removed") {
        this.userInProject = false;
      }
    })
  }
  updateReccomendation() {
    this.work.updatetaskreccomendation(new NewReccomendation(this.worktaskid,this.taskreccomendation)).subscribe((data) => {
      this.servermessage = data.message;
      if(this.servermessage == "saved") {
        this.work.getonetaskbyid(this.worktaskid).subscribe(data => {
          this.worktaskinf = data;
          this.taskreccomendation = this.worktaskinf[0].reccomendation;
        });
      }
    })
  }

  downloadFile() {
    const data = JSON.stringify(this.projectinf[0], null, 2);
    const blob = new Blob(['Structure of project\n\n', data], { type: 'text/plain' });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename:string = this.projectinf[0].projectname;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  

}
