import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;

  constructor(
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private router: Router
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

  async register(email: string, password: string, name: string, mediaURL: File | undefined) {
    try {
      const userCredentials = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredentials.user;
      let mediaURLUploaded: string | undefined = undefined;
      if (user) {
        if (mediaURL) {
          const uploadResult = await this.uploadImage(mediaURL, user.uid);
          mediaURLUploaded = uploadResult;
        }
        this.userData = {
          uid: user.uid,
          email: user.email,
          name: name,
          mediaURL: mediaURLUploaded
        };
        localStorage.setItem('user', JSON.stringify(this.userData));
        await this.firestore.collection('users').doc(user.uid).set({
          uid: user.uid,
          email: user.email,
          name: name,
          mediaURL: mediaURLUploaded
        });
        return {
          user: this.userData,
          name: user.displayName,
          mediaURL: mediaURLUploaded
        };
      } else {
        throw new Error('Usuário não locazalizado após cadastro!');
      }
    } catch (error) {
      throw error;
    }
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password).then(() => {
      this.auth.authState.subscribe(user => {this.userData = user
        localStorage.setItem('user', JSON.stringify(this.userData));
      })
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
}
