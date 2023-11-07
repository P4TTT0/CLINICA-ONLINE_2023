import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-validate',
  templateUrl: './email-validate.component.html',
  styleUrls: ['./email-validate.component.css']
})
export class EmailValidateComponent {

  constructor(private router : Router) {}

  public onLoginClick()
  {
    this.router.navigateByUrl('login');
  }
}
