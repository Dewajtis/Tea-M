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
    this.userid = this.activateRoute.snapshot.params['userid'];
    this.projectid = this.activateRoute.snapshot.params['projectid'];
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
    /*Формування тексту файлу*/
    let content = `Structure of project ${this.projectinf[0].projectname}:\n\n`;
    content += `Manager of project ${this.projectinf[0].teamlead.name}, ${this.projectinf[0].teamlead.email}\n\n`;
    content += `Developers:\n`;
    for (const member of this.projectinf[0].members) {
      content += `  - ${member.name}, ${member.email}\n`;
    }
    content += '\n';
    for (const list of this.projectinf[0].lists) {
      content += `List ${list.listname}:\n`;
      for (const task of list.tasks) {
        content += `  - Task ${task.name}, status ${task.status}\n`;
      }
      content += '\n';
    }
    const currentDate = this.datepipe.transform(new Date(), 'dd-MM-yyyy');
    content += `Date of formation: ${currentDate}`;
    /*Завантаження файлу*/
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.projectinf[0].projectname}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  

}
