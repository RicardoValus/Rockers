import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/models/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
    });
  }

  goToLoginPage() {
    this.router.navigate(['/login']);
  }

  async presentToast(message: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'top'
    });
    toast.present();
  }

  submitForm() {
    if (!this.registerForm.valid) {
      this.presentToast('Erro ao Cadastrar!', 2000);
    } else {
      const formData = this.registerForm.value;

      if (formData.password !== formData.passwordConfirmation) {
        this.presentToast('A senha e a confirmação de senha não coincidem!', 3000);
        return;
      }

      this.auth.register(formData.email, formData.password, formData.username).then(() => {
        this.presentToast('Registro realizado com sucesso!', 1500);
        this.router.navigate(['/login']);
      }).catch((error) => {
        console.error('Erro ao cadastrar:', error);
        this.presentToast('Erro ao cadastrar!', 3000);
      });
    }
  }
}
