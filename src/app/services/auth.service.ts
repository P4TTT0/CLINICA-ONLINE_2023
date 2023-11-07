import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DataService } from './data.service';
import {
  sendEmailVerification,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public ngFireAuth : AngularFireAuth, private data : DataService) { }

  public logueado : boolean = false;
  public userName : string = "";
  public validationState : boolean | null = null;

  public async logIn(emailOrUsername: string, password: string) {
    try {
      let userEmail = emailOrUsername;
      
      if (!emailOrUsername.includes('@')) {
        userEmail = await this.data.GetUserEmailByUserName(emailOrUsername) || '';
      }
  
      const credential = await this.ngFireAuth.signInWithEmailAndPassword(userEmail, password);
      const uid = await this.getUserUid() || '';
      this.userName = await this.data.getUserNameByUID(uid);
      this.validationState = await this.data.getValidationStateByUID(uid);
      this.logueado = true;

      return credential;
    } catch (error) {
      return null;
    }
  }

  public async logOut()
  {
    this.logueado = false;
    this.userName = '';
    localStorage.removeItem('userToken');
    return await this.ngFireAuth.signOut();
  }

  public async register(userData : any, password : string)
  {
    const userExist = await this.data.userExist(userData['UserName']);
    if(!userExist)
    {
      const userCredential = await this.ngFireAuth.createUserWithEmailAndPassword(userData['Email'], password);
      await this.logIn(userData['Email'], password);
      const user = userCredential.user;
      const userUID = await this.getUserUid() || '';
      if(user != null)
      {
        await sendEmailVerification(user);
      }
      await this.data.SaveUser(userUID, userData);
      return true;
    }
    return false;
  }

  public async getUserUid()
  {
    return new Promise<string | null>((resolve, reject) => 
    {
      this.ngFireAuth.authState.subscribe(user => {
        if (user) {
          resolve(user.uid);
        } else {
          resolve(null); 
        }
      });
    });
  }

  public async reLogin() 
  {
    const uid = await this.getUserUid() || '';
    this.userName = await this.data.getUserNameByUID(uid);
    this.logueado = true;
  }
}
