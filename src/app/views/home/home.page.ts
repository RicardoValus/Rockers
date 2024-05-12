import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/models/services/firebase/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  selectedServices: { name: string, uid: string }[] = [];
  services: { name: string, uid: string }[] = [
    { name: 'Aparar', uid: 'service1' },
    { name: 'Cuidado capilar', uid: 'service2' },
    { name: 'Lavagem de cabelo', uid: 'service3' },
    { name: 'Corte de cabelo', uid: 'service4' }
  ];
  JSON: any;

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
  homePageSelectedServices: any;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router,
    private firebaseService: FirebaseService,
    private afs: AngularFirestore,
    private route: ActivatedRoute
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

  toggleService(service: { name: string, uid: string }) {
    const index = this.selectedServices.findIndex((s) => s.uid === service.uid);
    if (index > -1) {
      this.selectedServices.splice(index, 1);
    } else {
      this.selectedServices.push(service);
    }
    console.log('selectedServices:', this.selectedServices);
  }

  isSelectedService(service: { name: string, uid: string }): boolean {
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
    if (!this.selectedBarber || !this.selectedDate || !this.selectedTime) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor, selecione o barbeiro, data e hora antes de agendar.',
        duration: 2000,
        position: position,
      });
      await toast.present();
      return;
    }

    const appointmentData = {
      barber: this.selectedBarber,
      date: this.selectedDate,
      time: this.selectedTime,
      services: this.homePageSelectedServices.map((service: any) => service.name),
    };

    try {
      await this.afs.collection('appointments').add(appointmentData);
      const toast = await this.toastCtrl.create({
        message: 'Agendamento realizado com sucesso!',
        duration: 1500,
        position: position,
      });
      await toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Erro ao agendar: ',
        duration: 2000,
        position: position,
      });
      await toast.present();
    }
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

  // async exitAlert() {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Deseja sair da sua conta?',
  //     buttons: [
  //       {
  //         text: 'Não',
  //         role: 'cancel',
  //         cssClass: 'alert-button-cancel',
  //       },
  //       {
  //         text: 'Sim',
  //         cssClass: 'alert-button-confirm',
  //         handler: () => {
  //           this.exitToast();
  //           this.router.navigate(['/login']);
  //         },
  //       },
  //     ],
  //   });

  //   await alert.present();
  // }

  // async exitToast() {
  //   const toast = await this.toastCtrl.create({
  //     message: 'Você saiu com sucesso!',
  //     duration: 1500,
  //     position: 'top',
  //   });
  //   toast.present();
  // }

}
