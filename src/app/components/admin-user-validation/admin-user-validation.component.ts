import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { MatDialog, DialogPosition } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-user-validation',
  templateUrl: './admin-user-validation.component.html',
  styleUrls: ['./admin-user-validation.component.css']
})
export class AdminUserValidationComponent implements OnInit{
  
  public usersNotAccepted : any[] = [];

  constructor(public data : DataService, private dialog: MatDialog, private router : Router) { }

  async ngOnInit() 
  {
    this.usersNotAccepted = await this.data.GetUsersNotAccepted();
  }

  public async onDecideClick(validation : boolean, userName : string)
  {
    let userUID = await this.data.getUIDByUserName(userName) || '';
    await this.data.UpdateValidationUser(userUID, validation);
    this.usersNotAccepted = await this.data.GetUsersNotAccepted();
  }

  public onCreateUserClick()
  {
    this.router.navigateByUrl('register');
  }

}
