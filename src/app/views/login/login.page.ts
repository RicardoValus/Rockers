import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/models/services/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private toastCtrl: ToastController,
    private authService: AuthService,
    private navCtrl: NavController
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async login() {
    this.loading = true;
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;
    try {
      await this.authService.login(username, password);

      // this.router.navigate(['/home']);
      this.navCtrl.navigateRoot(['/home']);
      this.presentToast('Login realizado com sucesso!');
      this.loading = false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      this.presentToast('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
      this.loading = false;
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  goToRegisterPage() {
    this.router.navigate(['/register']);
  }
  
  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }
}
