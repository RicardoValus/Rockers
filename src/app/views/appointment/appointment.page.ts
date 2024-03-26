import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
// import { CalendarModalPage } from 'src/app/calendar-modal/calendar-modal.page';
// import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.page.html',
  styleUrls: ['./appointment.page.scss'],
})
export class AppointmentPage implements OnInit {

  selectedDateTime!: string;
  selectedBarber: string | null = null;
  barbers: string[] = ['Barber 1', 'Barber 2'];
  // , 'Barber 3', 'Barber 4'
  showCalendar: boolean = false;

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    // private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  toggleBarber(barber: string) {
    if (this.selectedBarber === barber) {
      this.selectedBarber = null;
    } else {
      this.selectedBarber = barber;
    }
  }

  isSelected(barber: string): boolean {
    return this.selectedBarber === barber;
  }

  getImagePath(barber: string): string {
    if (barber === 'Barber 1') {
      return 'assets/manoguaxi.jpeg';
    } else if (barber === 'Barber 2') {
      return 'assets/manoguaxi.jpeg';
      // } else if (barber === 'Barber 3') {
      //   return 'assets/manoguaxi.jpeg';
      // } else if (barber === 'Barber 4') {
      //   return 'assets/manoguaxi.jpeg';
    } else {
      return '';
    }
  }

  toggleCalendar() {
    setTimeout(() => {
      this.showCalendar = !this.showCalendar;
    });
  }

  closeCalendar() {
    this.showCalendar = false;
  }

  selectDateAndClose(event: any) {
    this.selectedDateTime = event.detail.value;
    this.showCalendar = false;
  }

  getFormattedDateTime(): string {
    if (!this.selectedDateTime) return '';

    const date = new Date(this.selectedDateTime);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const formattedTime = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

    return `Agendado para ${formattedDate} às ${formattedTime}`;
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString();
  }

  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  };

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Deseja cancelar seu agendamento?',
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
            this.presentToast();
          },
        },
      ],
    });

    await alert.present();
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Agendamento cancelado com sucesso!',
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }

  async confirmToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastCtrl.create({
      message: 'Agendamento realizado com sucesso!',
      duration: 1500,
      position: position,
    });

    await toast.present();
  }

  // async openModal() {
  //   const modal = await this.modalController.create({
  //     component: CalendarModalPage,
  //     componentProps: {
  //       // Se precisar passar parâmetros para a página modal, você pode fazer isso aqui
  //     }
  //   });
  //   return await modal.present();
  // }
}
