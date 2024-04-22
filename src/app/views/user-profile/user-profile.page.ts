import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  profilePicture: SafeUrl | undefined;
  profileForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private sanitizer: DomSanitizer) {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result as string;
      this.profilePicture = this.sanitizer.bypassSecurityTrustUrl(dataURL);
    };
    reader.readAsDataURL(file);
  }

  saveProfile() {
    const name = this.profileForm.get('name')?.value;
    console.log('Nome:', name);
  }
}

