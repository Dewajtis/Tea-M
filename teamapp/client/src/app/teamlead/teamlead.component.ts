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

@Component({
  selector: 'app-teamlead',
  templateUrl: './teamlead.component.html',
  styleUrls: ['./teamlead.component.css']
})
export class TeamleadComponent implements OnInit {

  USERISLEAD: boolean = false;
  userInProject: boolean = true;

  userid: string = "";
  projectid: string = "";
  userinf: any[] = [];
  projectinf: any[] = [];


  worklistid: string = "";
  worktaskid: string = "";
  worktaskinf: any[] = [];

  addeditlistname: string = "";
  addcustomername: string = "";
  addmembername: string = "";
  removemembername: string = "";

  edittaskname: string = "";
  edittaskstartdate: Date = new Date();
  edittaskduedate: Date = new Date();
  editattachusername: string = "";
  edittaskdescription: string = "";
  edittaskstatus: string = "";
  taskpercentinput: number = 19;
  addtaskcomment: string = "";

  editstartdateinf: any;
  editduedateinf: any;
  

  taskname: string = "";
  taskstartdate: Date = new Date();
  taskduedate: Date = new Date();
  attachusername: string = "";
  taskdescription: string = "";
  
  servermessage: string = "default";

  isUserPanel: boolean = true;
  isTeamPanel: boolean = false;
  isAddListPanel: boolean = false;
  isEditListPanel: boolean = false;
  isAddTaskPanel: boolean = false;
  isEditTaskPanel: boolean = false;
  isCustomer: boolean = true;
  isMembers: boolean = true;

  badCustomerName: boolean = false;
  badMemberName: boolean = false;

  constructor(private activateRoute: ActivatedRoute, private work: WorkwhdataService, private datepipe: DatePipe) {
    this.userid = activateRoute.snapshot.params['userid'];
    this.projectid = activateRoute.snapshot.params['projectid'];
   }

  ngOnInit(): void {
    this.work.getoneuserbyid(this.userid).subscribe(data0 => {
      this.userinf = data0;
      this.work.getoneprojectbyid(this.projectid).subscribe(data => {
        this.projectinf = data;
        if(this.projectinf[0].customer == undefined) {
          this.isCustomer = false;
        }
        else {
          this.isCustomer = true;
        }
  
        if(this.projectinf[0].members.length == 0) {
          this.isMembers = false;
        }
        else {
          this.isMembers = true;
        }
  
        if(this.projectinf[0].teamlead.name==this.userinf[0].username) {
          this.USERISLEAD = true;
        }
      });
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
  openAddListPanel(): void {
    this.isAddListPanel = true;
  }
  closeAddEditListPanel(): void {
    this.isAddListPanel = false;
    this.isEditListPanel = false;
  }
  openEditListPanel(listid: string): void {
    this.isEditListPanel = true;
    this.worklistid = listid;
  }
  openAddTaskPanel(listid: string): void {
    this.worklistid = listid;
    this.isAddTaskPanel = true;
    this.taskname = "";
    this.taskdescription = "";
    this.taskstartdate = new Date();
    this.taskduedate = new Date();
  }
  openEditTaskPanel(listid: string, taskid: string): void {
    this.worklistid = listid;
    this.worktaskid = taskid;
    this.work.getonetaskbyid(this.worktaskid).subscribe(data => {
      this.worktaskinf = data;
      this.edittaskname = this.worktaskinf[0].taskname;
      this.edittaskstartdate = this.worktaskinf[0].startdate;
      this.edittaskduedate = this.worktaskinf[0].duedate;
      this.editattachusername = this.worktaskinf[0].mainmember;
      this.edittaskdescription = this.worktaskinf[0].description;
      this.edittaskstatus = this.worktaskinf[0].status;
      this.taskpercentinput = this.worktaskinf[0].percent;

      this.editstartdateinf = this.datepipe.transform(this.worktaskinf[0].startdate, 'dd-MM-yyyy');
      this.editduedateinf = this.datepipe.transform(this.worktaskinf[0].duedate, 'dd-MM-yyyy');
    });
    this.isEditTaskPanel = true;
  }
  closeAddTaskPanel(): void {
    this.isAddTaskPanel = false;
  }
  closeEditTaskPanel(): void {
    this.isEditTaskPanel = false;
  }
  
  addCustomer() {
    this.work.addcustomer(new NewPeople(this.projectinf[0]._id, this.projectinf[0].projectname,
      this.addcustomername)).subscribe((data) => {
          this.servermessage = data.message;
          if(this.servermessage == "saved") {
            this.badCustomerName = false;
            this.isCustomer = true;
            this.addcustomername = "";
            this.loadProjectInf();
          }
          else {
            if(this.servermessage == "badcustomername") {
              this.badCustomerName = true;
              this.isCustomer = false;
            }
          }
      });
  }
  removeCustomer() {
    this.work.removecustomer(new RemovePeople(this.projectid, this.projectinf[0].customer.name)).subscribe((data) => {
          this.servermessage = data.message;
          if(this.servermessage == "removed") {
            this.isCustomer = false;
            this.loadProjectInf();
          }
      });
  }

  addMember() {
    this.work.addmember(new NewPeople(this.projectinf[0]._id, this.projectinf[0].projectname,
      this.addmembername)).subscribe((data) => {
          this.servermessage = data.message;
          if(this.servermessage == "saved") {
            this.badMemberName = false;
            this.isMembers = true;
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
  removeMember() {
    this.work.removemember(new RemovePeople(this.projectid, this.removemembername)).subscribe((data) => {
        this.servermessage = data.message;
        if(this.servermessage == "removed") {
          this.loadProjectInf();
        }
      });
  }

  addList() {
    this.work.addlist(new AddListInf(this.projectid, this.addeditlistname)).subscribe((data) => {
      this.servermessage = data.message;
      if(this.servermessage == "saved") {
        this.addeditlistname = "";
        this.loadProjectInf();
      }
    })
  }
  renameList() {
    this.work.renamelist(new EditListInf(this.projectid, this.worklistid,
      this.addeditlistname)).subscribe((data) => {
      this.servermessage = data.message;
      if(this.servermessage == "saved") {
        this.addeditlistname = "";
        this.loadProjectInf();
      }
    })
  }
  removeList(idlist:string) {
    this.worklistid = idlist;
    this.work.removelist(new AddListInf(this.projectid, this.worklistid)).subscribe((data) => {
      this.servermessage = data.message;
      if(this.servermessage == "removed") {
        this.loadProjectInf();
      }
    })
  }
  
  addTask() {
    this.work.addtask(new NewTask(this.projectid,this.worklistid,this.taskname,this.taskstartdate,
      this.taskduedate,this.attachusername,this.taskdescription)).subscribe((data) => {
        this.servermessage = data.message;
        if(this.servermessage == "saved") {
          this.taskname = "";
          this.taskdescription = "";
          this.loadProjectInf();
        }
      })
  }
  updateTaskInf() {
    this.work.updatetaskinf(new UpdateTaskInf(this.projectid, this.worktaskid, this.edittaskname, 
      this.edittaskstartdate,this.edittaskduedate,this.editattachusername,this.edittaskdescription)).subscribe((datas) => {
      this.servermessage = datas.message;
      if(this.servermessage == "saved") {
        this.work.getonetaskbyid(this.worktaskid).subscribe(data => {
          this.worktaskinf = data;
          this.edittaskstartdate = this.worktaskinf[0].startdate;
          this.edittaskduedate = this.worktaskinf[0].duedate;

          this.editstartdateinf = this.datepipe.transform(this.worktaskinf[0].startdate, 'dd-MM-yyyy');
          this.editduedateinf = this.datepipe.transform(this.worktaskinf[0].duedate, 'dd-MM-yyyy');

          this.loadProjectInf();
        });
      }
    })
  }
  deleteTask() {
    this.work.deletetask(this.worktaskid,this.projectid).subscribe((data) => {
      this.servermessage = data.message;
      if(this.servermessage == "deleted") {
        this.isEditTaskPanel = false;
        this.loadProjectInf();
      }
    })
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

  deleteProject() {
    this.work.deleteproject(this.projectid).subscribe((data) => {
      this.servermessage = data.message;
      if(this.servermessage == "deleted") {
        this.userInProject = false;
      }
    })
  }

}
