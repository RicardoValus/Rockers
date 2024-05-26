import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  profilePicture: SafeUrl | undefined;
  profileForm!: FormGroup;

  constructor(private sanitizer: DomSanitizer) {

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

  }
}
