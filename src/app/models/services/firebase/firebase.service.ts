import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  userData: any;
  constructor(
    private auth: AngularFireAuth,
  ) { 
    this.auth.authState.subscribe(user => {
      if(user){
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', 'null')
      }
    })
  }

  public register(email: string, password: string){
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  public login(email: string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  public resetPassword(email: string){
    return this.auth.sendPasswordResetEmail(email);
  }
}