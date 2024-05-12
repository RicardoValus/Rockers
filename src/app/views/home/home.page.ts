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

  showTime: boolean = false;
  selectedTime: string | null = null;
  hourValues: string[] = [];
  homePageSelectedServices: any;


  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router,
    private firebaseService: FirebaseService,
  ) { }

  ngOnInit() {
    const barberSubscription = this.firebaseService.getBarbers().subscribe(res => {
      this.barbers = res.map(barber => {
        return { id: barber.payload.doc.id, ...barber.payload.doc.data() as any } as any
      })
    })
    this.subscriptions.push(barberSubscription)

  }


  //serviços \/


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


  //serviços /\

  //agendamentos \/


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


  //agendamentos /\
}
