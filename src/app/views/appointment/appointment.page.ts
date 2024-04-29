import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/models/services/firebase/firebase.service';
// import { CalendarModalPage } from 'src/app/calendar-modal/calendar-modal.page';
// import { ModalController } from '@ionic/angular';

interface Barber {
  id: string;
  barberName: string;
  barberAvatar: string;
}

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.page.html',
  styleUrls: ['./appointment.page.scss'],
})
export class AppointmentPage implements OnInit {

  selectedBarber: string | null = null;
  barbers: any
  // , 'Barber 3', 'Barber 4'
  newBarberName: string = '';
  subscriptions: Subscription[] = []
  barberID: string = ''
  image: any;

  showCalendar: boolean = false;
  selectedDate!: string;

  showTime: boolean = false;
  selectedTime: string | null = null;
  hourValues: string[] = [];

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    const barberSubscription = this.firebaseService.getBarbers().subscribe(res => {
      this.barbers = res.map(barber => {
        return { id: barber.payload.doc.id, ...barber.payload.doc.data() as any } as any
      })
    })
    this.subscriptions.push(barberSubscription)
    this.generateHourValues();
  }

  toggleBarber(barber: string) {
    if (this.selectedBarber === barber) {
      this.selectedBarber = null;
    } else {
      this.selectedBarber = barber;
    }
  }

  uploadFile(image: any) {
    this.image = image.files;
  }

  isSelected(barber: string): boolean {
    return this.selectedBarber === barber;
  }

  // getImagePath(barber: string): string {
  //   if (barber === 'Barber 1') {
  //     return 'assets/manoguaxi.jpeg';
  //   } else if (barber === 'Barber 2') {
  //     return 'assets/manoguaxi.jpeg';
  //     // } else if (barber === 'Barber 3') {
  //     //   return 'assets/manoguaxi.jpeg';
  //     // } else if (barber === 'Barber 4') {
  //     //   return 'assets/manoguaxi.jpeg';
  //   } else {
  //     return '';
  //   }
  // }

  toggleCalendar() {
    setTimeout(() => {
      this.showCalendar = !this.showCalendar;
    });
  }

  closeCalendar() {
    this.showCalendar = false;
  }

  selectDateAndClose(event: any) {
    this.selectedDate = event.detail.value;
    this.showCalendar = false;
  }

  getFormattedDate(): string {
    if (!this.selectedDate) return '';

    const date = new Date(this.selectedDate);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    // const formattedTime = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

    return `Data agendada para ${formattedDate}`;
    // às ${formattedTime}
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

  toggleTime() {
    if (this.showCalendar) {
      this.showCalendar = false;
    }
    this.showTime = !this.showTime;
  }

  closeTime() {
    this.showTime = false;
  }

  selectTimeAndClose(event: any) {
    this.selectedTime = event.detail.value;
    this.showTime = false;
  }
  
  getFormattedTime(): string {
    if (!this.selectedTime) return '';

    const time = new Date(this.selectedTime);
    const formattedTime = `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;

    return `Horário agendado para às ${formattedTime}`;
  }

  generateHourValues() {
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour <= endHour; hour++) {
      const time = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      this.hourValues.push(time);
    }
  }

  isHourDisabled(hour: string): boolean {
    const scheduledAppointments: string[] = ['10:00', '13:00', '15:00'];
  
    return scheduledAppointments.includes(hour);
  }

    async confirmToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastCtrl.create({
      message: 'Agendamento realizado com sucesso!',
      duration: 1500,
      position: position,
    });

    await toast.present();
  }

  async cancelAppointmentAlert() {
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
            this.cancelAppointmentToast();
          },
        },
      ],
    });

    await alert.present();
  }

  async cancelAppointmentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Agendamento cancelado com sucesso!',
      duration: 1500,
      position: 'top',
    });
    toast.present();
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
