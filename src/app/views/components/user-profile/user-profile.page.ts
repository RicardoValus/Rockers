import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/models/services/auth/auth.service';
import { FirebaseService } from 'src/app/models/services/firebase/firebase.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  user: any;
  userImage!: string;
  profileForm!: FormGroup;
  subscriptions: Subscription[] = []
  profilePicture: SafeUrl | undefined;
  image: any;
  userID = this.authService.getLoggedUserThroughLocalStorage().uid

  constructor(
    private firebaseService: FirebaseService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private dialogRef: MatDialogRef<UserProfilePage>,
    private toastCtrl: ToastController
  ) {

  }

  ngOnInit() {
    const usersSubscription = this.firebaseService.getUsers().subscribe(res => {
      this.user = res.map(user => {
        return { id: user.payload.doc.id, ...user.payload.doc.data() as any } as any
      });
      this.userImage = this.user[0].mediaURL;
      this.profilePicture = this.user[0].mediaURL;
    });

    this.profileForm = this.formBuilder.group({
      profilePicture: ['']
    });

    this.subscriptions.push(usersSubscription)
  }

  uploadFile(image: any) {
    const file = image.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const imageDataUrl = reader.result as string;
      this.profilePicture = this.sanitizer.bypassSecurityTrustUrl(imageDataUrl);
    };
    reader.readAsDataURL(file);
    this.image = image.files;
  }

  async saveProfile() {
    console.log('SAVE PROFILE')
    const userIdFromFirestore = this.user[0].id
    const imageURL = await this.firebaseService.getImageDownloadURL(this.image, this.userID, userIdFromFirestore)
    this.authService.updateProfilePicture(imageURL, userIdFromFirestore)
    this.dialogRef.close();
    this.presentToast('Foto alterada com sucesso!')
  }

  closeDialog() {
    this.dialogRef.close();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }
}

