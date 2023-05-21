import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkwhdataService } from '../services/workwhdata.service';

export class NewProject{
  constructor(public projectname: string,
              public teamlead: string,
              public email: string)
  {}
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  id: String = "";
  userinf: any[] = [];
  addPanel: boolean = false;
  isLead: boolean = false;
  isMember: boolean = false;
  isCustomer: boolean = false;
  projectname: string = "";
  servermessage: string = "";

  constructor(private activateRoute: ActivatedRoute, private work: WorkwhdataService) {
    this.id = activateRoute.snapshot.params['userid'];
   }

  ngOnInit(): void {
    this.work.getoneuserbyid(this.id).subscribe((data) =>
    {this.userinf = data;
      if(this.userinf[0].role=="Team Lead") {
        this.isLead = true;
        this.isMember = false;
        this.isCustomer = false;
      }
      if(this.userinf[0].role=="Team Member") {
        this.isLead = false;
        this.isMember = true;
        this.isCustomer = false;
      }
      if(this.userinf[0].role=="Customer") {
        this.isLead = false;
        this.isMember = false;
        this.isCustomer = true;
      }});
  }

  private loadUserInf() {
    this.work.getoneuserbyid(this.id).subscribe((data) =>
              {this.userinf = data;});
  }

  openPanel() {
    this.addPanel = true;
  }
  closePanel() {
    this.addPanel = false;
  }
  addProject() {
    this.work.addnewproject(new NewProject(this.projectname, 
      this.userinf[0].username, this.userinf[0].email)).subscribe((data) => {
          this.servermessage = data.message;
          if(this.servermessage == "saved") {
            this.projectname = "";
            this.loadUserInf();
          }
          });
  }
}
