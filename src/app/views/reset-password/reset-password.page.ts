import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/models/services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  resetPasswordForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  resetPassword(email: string) {
    if (this.resetPasswordForm.valid) {
      this.authService.resetPassword(email)
        .then(() => {
          this.router.navigate(['/login']);
        })
        .catch((error: any) => {
          console.error('Erro ao enviar e-mail de redefinição de senha:', error);
        });
    }
  }

  goToLoginPage() {
    this.router.navigate(['/login']);
  }
}
