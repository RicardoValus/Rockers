import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable, map, of, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;

  constructor(
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private router: Router,
    private navCtrl: NavController
  ) {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          mediaURL: user.photoURL
        }
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', 'null')
      }
    });
  }

  async register(email: string, password: string, name: string) {
    try {
      const userCredentials = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredentials.user;
      if (user) {
        this.userData = {
          uid: user.uid,
          email: user.email,
          name: name,
          mediaURL: ''
        };
        localStorage.setItem('user', JSON.stringify(this.userData));
        await this.firestore.collection('users').doc(user.uid).set({
          uid: user.uid,
          email: user.email,
          name: name,
          mediaURL: ''
        });
        return {
          user: this.userData,
          name: user.displayName,
          mediaURL: ''
        };
      } else {
        throw new Error('Usuário não locazalizado após cadastro!');
      }
    } catch (error) {
      throw error;
    }
  }

  isAdmin(): Observable<boolean> {
    const user = this.getLoggedUserThroughLocalStorage();
    if (user && user.uid) {
      return this.firestore.collection('users').doc(user.uid).valueChanges().pipe(
        map(userData => {
          if (userData && typeof userData === 'object' && 'isAdmin' in userData) {
            return (userData as { isAdmin: boolean }).isAdmin;
          } else {
            return false;
          }
        })
      );
    }
    return of(false);
  }

  async login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password).then(() => {
      this.auth.authState.pipe(take(1)).subscribe(user => {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        this.isAdmin().pipe(take(1)).subscribe(isAdmin => {
          if (isAdmin) {
            this.navCtrl.navigateRoot(['/admin']);
          } else {
            this.navCtrl.navigateRoot(['/home']);
          }
        });
      });
    });
  }

  resetPassword(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }

  private async uploadImage(mediaURL: File, userId: string): Promise<string> {
    try {
      const storageRef = this.storage.ref(`users/${userId}/${mediaURL.name}`);
      const uploadTask = await storageRef.put(mediaURL);
      const downloadURL = await uploadTask.ref.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  }

  getLoggedUserThroughLocalStorage() {
    const user: any = JSON.parse(localStorage.getItem('user') || 'null');
    return (user !== null) ? user : null;
  }

  updateProfilePicture(newImageURL: string, id: string) {
    return this.firestore.collection('users').doc(id).update({
      mediaURL: newImageURL
    })
  }

  signOut(): Promise<void> {
    if (this.getLoggedUserThroughLocalStorage() === null) {
      return Promise.resolve();
    }
    return this.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
      console.log('Deslogado')
    });
  }
}
