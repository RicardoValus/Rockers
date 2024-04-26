import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  selectedServices: { name: string, uid: string }[] = [];
  services: { name: string, uid: string }[] = [
    { name: 'Aparar', uid: 'service1' },
    { name: 'Cuidado capilar', uid: 'service2' },
    { name: 'Lavagem de cabelo', uid: 'service3' },
    { name: 'Corte de cabelo', uid: 'service4' }
  ];

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  toggleService(service: { name: string, uid: string }) {
    const index = this.selectedServices.findIndex((s) => s.uid === service.uid);
    if (index > -1) {
      this.selectedServices.splice(index, 1);
    } else {
      this.selectedServices.push(service);
    }
    console.log('selectedServices:', this.selectedServices);
  }

  isSelected(service: { name: string, uid: string }): boolean {
    return this.selectedServices.some((s) => s.uid === service.uid);
  }

  async exitAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Deseja sair da sua conta?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Sim',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.exitToast();
            this.router.navigate(['/login']);
          },
        },
      ],
    });

    await alert.present();
  }

  async exitToast() {
    const toast = await this.toastCtrl.create({
      message: 'Você saiu com sucesso!',
      duration: 1500,
      position: 'top',
    });
    toast.present();
  }

  getImagePath(serviceName: string): string {
    switch (serviceName) {
      case 'Aparar':
        return 'assets/bigode.png';
      case 'Cuidado capilar':
        return 'assets/produtos.png';
      case 'Lavagem de cabelo':
        return 'assets/chuveiro.png';
      case 'Corte de cabelo':
        return 'assets/tesoura.png';
      default:
        return '';
    }
  }
  
}
