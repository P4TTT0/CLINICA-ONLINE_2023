import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-no-validated',
  templateUrl: './no-validated.component.html',
  styleUrls: ['./no-validated.component.css']
})
export class NoValidatedComponent implements OnInit {
  public joinDate : any;
  constructor(public auth : AuthService, private data : DataService)
  {

  }

  async ngOnInit(){
    this.joinDate = await this.data.getJoinDateByUserName(this.auth.userName);
  }
}
