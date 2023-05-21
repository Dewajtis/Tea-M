import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkwhdataService } from '../services/workwhdata.service';
import { DatePipe } from '@angular/common';

export class NewPeople{
  constructor(public projectid: string,
              public projectname: string,
              public user: string)
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
export class RemovePeople{
  constructor(public projectid: string,
              public username: string)
  {}
}

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  USERISMEMBER: boolean = false;
  userInProject: boolean = true;

  userid: string = "";
  projectid: string = "";
  userinf: any[] = [];
  projectinf: any[] = [];

  worklistid: string = "";
  worktaskid: string = "";
  worktaskinf: any[] = [];

  addmembername: string = "";

  edittaskstatus: string = "";
  taskpercentinput: number = 0;
  addtaskcomment: string = "";
  editstartdateinf: any;
  editduedateinf: any;
  
  servermessage: string = "default";

  isUserPanel: boolean = true;
  isTeamPanel: boolean = false;
  isEditTaskPanel: boolean = false;
  isCustomer: boolean = true;
  badMemberName: boolean = false;

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
      if(this.projectinf[0].customer == undefined) {
        this.isCustomer = false;
      }
      else {
        this.isCustomer = true;
      }

      const member:{name:string,id:string}|undefined = this.projectinf[0].members.find(
        (member:{name:string,id:string}) => member.name === this.userinf[0].username);
      if(member) {
        this.USERISMEMBER = true;
      }
    });
  }

  private loadProjectInf() {
    this.work.getoneprojectbyid(this.projectid).subscribe(data => {
      this.projectinf = data;
    });
  }
  private loadTaskInf() {
    this.work.getonetaskbyid(this.worktaskid).subscribe(data => {
      this.worktaskinf = data;
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
      this.edittaskstatus = this.worktaskinf[0].status;
      this.taskpercentinput = this.worktaskinf[0].percent;

      this.editstartdateinf = this.datepipe.transform(this.worktaskinf[0].startdate, 'dd-MM-yyyy');
      this.editduedateinf = this.datepipe.transform(this.worktaskinf[0].duedate, 'dd-MM-yyyy');
    });
    this.isEditTaskPanel = true;
  }
  closeEditTaskPanel(): void {
    this.isEditTaskPanel = false;
  }

  addMember() {
    this.work.addmember(new NewPeople(this.projectinf[0]._id, this.projectinf[0].projectname,
      this.addmembername)).subscribe((data) => {
          this.servermessage = data.message;
          if(this.servermessage == "saved") {
            this.badMemberName = false;
            this.addmembername = "";
            this.loadProjectInf();
          }
          else {
            if(this.servermessage == "badmembername") {
              this.badMemberName = true;
            }
          }
      });
  }

  updateTaskStatus() {
    this.work.updatetaskstatus(new NewTaskStatus(this.worktaskid,this.projectid,
      this.edittaskstatus, this.taskpercentinput)).subscribe((datas) => {
        this.servermessage = datas.message;
        if(this.servermessage=="saved") {
          this.work.getonetaskbyid(this.worktaskid).subscribe(data => {
            this.worktaskinf = data;
            this.edittaskstatus = this.worktaskinf[0].status;
            this.taskpercentinput = this.worktaskinf[0].percent;
            this.loadProjectInf();
          });
        }
      })
  }

  addComment() {
    this.work.addcomment(new NewComment(this.worktaskid,this.userinf[0].username,
      this.addtaskcomment)).subscribe((data) => {
      this.servermessage = data.message;
      if(this.servermessage=="saved") {
        this.addtaskcomment = "";
        this.loadTaskInf();
      }
    })
  }

  memberLeaveProject() {
    this.work.removemember(new RemovePeople(this.projectid,this.userinf[0].username)).subscribe((data) => {
      this.servermessage = data.message;
      if(this.servermessage=="removed") {
        this.userInProject = false;
      }
    })
  }

}
