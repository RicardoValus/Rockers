import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  senha: string = '';
  erroLogin: boolean = false;
  loginForm!: FormGroup;

  constructor(

    private formBuilder: FormBuilder, private router: Router, private toastCtrl: ToastController

  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  goToRegisterPage() {
    this.router.navigate(['/register']);
  }

  async confirmToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastCtrl.create({
      message: 'Você entrou com sucesso!',
      duration: 1500,
      position: position,
    });

    await toast.present();
  }
}
