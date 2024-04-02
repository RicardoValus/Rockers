import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  selectedServices: string[] = [];
  services: string[] = ['Aparar', 'Cuidado capilar', 'Lavagem de cabelo', 'Corte de cabelo'];


  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  toggleService(service: string) {
    const index = this.selectedServices.indexOf(service);
    if (index > -1) {
      this.selectedServices.splice(index, 1);
    } else {
      this.selectedServices.push(service);
    }
  }

  isSelected(service: string): boolean {
    return this.selectedServices.includes(service);
  }

  getImagePath(service: string): string {
    if (service === 'Aparar') {
      return 'assets/bigode.png';
    } else if (service === 'Cuidado capilar') {
      return 'assets/produtos.png';
    } else if (service === 'Lavagem de cabelo') {
      return 'assets/chuveiro.png';
    } else if (service === 'Corte de cabelo') {
      return 'assets/tesoura.png';
    } else {
      return '';
    }
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
}

