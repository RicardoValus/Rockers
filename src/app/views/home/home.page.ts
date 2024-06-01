import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/models/services/auth/auth.service';
import { FirebaseService } from 'src/app/models/services/firebase/firebase.service';
import { UserProfilePage } from '../components/user-profile/user-profile.page';

interface Appointment {
  services: { name: string, uid: string }[];
  barber: any;
  date: string;
  time: string;
  userId: string;
  userName: string;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  profileForm!: FormGroup;
  userID = this.authService.getLoggedUserThroughLocalStorage().uid

  selectedServices: { name: string, uid: string }[] = [];
  services: { name: string, uid: string }[] = [
    { name: 'Aparar', uid: 'service1' },
    { name: 'Cuidado capilar', uid: 'service2' },
    { name: 'Lavagem de cabelo', uid: 'service3' },
    { name: 'Corte de cabelo', uid: 'service4' }
  ];
  JSON: any;

  barbers: any
  selectedBarber: any = null;
  newBarberName: string = '';
  subscriptions: Subscription[] = []
  barberID: string = ''
  image: any;

  showTime: boolean = false;
  selectedTime: string | null = null;
  times: any

  selectedDate!: string;

  appointment: Appointment = {
    services: [],
    barber: null,
    date: '',
    time: '',
    userId: '',
    userName: ''
  };

  appointments: any;

  user: any;
  userName!: string;
  userImage!: string;

  profilePicture: SafeUrl | undefined;


  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router,
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    const barberSubscription = this.firebaseService.getBarbers().subscribe(res => {
      this.barbers = res.map(barber => {
        return { id: barber.payload.doc.id, ...barber.payload.doc.data() as any } as any
      })
    })

    const timeSubscription = this.firebaseService.getTimes().subscribe(res => {
      this.times = res.map(time => {
        return { id: time.payload.doc.id, ...time.payload.doc.data() as any } as any
      });
    });

    const appointmentsSubscription = this.firebaseService.getUserAppointments().subscribe(res => {
      this.appointments = res.map(appointment => {
        const appointmentData = appointment.payload.doc.data() as any;
        const id = appointment.payload.doc.id;
        console.log(id)
        return { id, ...appointmentData } as Appointment;
      });
    });

    const usersSubscription = this.firebaseService.getUsers().subscribe(res => {
      this.user = res.map(user => {
        return { id: user.payload.doc.id, ...user.payload.doc.data() as any } as any
      });
      this.setAppointmentsUserName();
      this.userName = this.user[0].name;
      this.userImage = this.user[0].mediaURL;
    });

    this.profileForm = this.formBuilder.group({
      profilePicture: ['']
    });

    this.setAppointmentUserId();
    this.subscriptions.push(barberSubscription, timeSubscription, appointmentsSubscription, usersSubscription)

  }

  //serviço
  toggleService(service: { name: string, uid: string }) {
    const index = this.selectedServices.findIndex((s) => s.uid === service.uid);
    if (index > -1) {
      this.selectedServices.splice(index, 1);
      const indexAppointment = this.appointment.services.findIndex((s) => s.uid == service.uid);
      if (indexAppointment > -1) {
        this.appointment.services.splice(indexAppointment, 1);
      }
    } else {
      this.selectedServices.push(service);
      this.appointment.services.push(service);
    }
  }

  isSelectedService(service: { name: string, uid: string }): boolean {
    return this.selectedServices.some((s) => s.uid === service.uid);
  }

  signOut(): void {
    this.authService.signOut();
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
            this.signOut();
            this.exitToast();
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

  //barbeiros
  toggleBarber(barber: any) {
    this.selectedBarber = barber;
    this.appointment.barber = barber;
  }


  isSelected(barber: string): boolean {
    return this.selectedBarber === barber;
  }


  //datas
  formatarData(data: string): string {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }

  async selectDate() {
    const dataFormatada = this.formatarData(this.selectedDate);
    this.appointment.date = dataFormatada;
    this.dateToast()
  }


  //horários
  onTimeChange(event: any) {
    this.appointment.time = event.target.value.time;
  }




  setAppointmentUserId() {
    this.appointment.userId = this.authService.getLoggedUserThroughLocalStorage().uid
  }

  setAppointmentsUserName() {
    this.appointment.userName = this.user[0].name
  }


  async deleteAppointment(index: number) {
    console.log(this.appointments[index].id)
    const appointmentId = this.appointments[index].id

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
            this.firebaseService.removeAppointment(appointmentId).then(() => {
              this.cancelAppointmentToast();
            }).catch((error) => {
              console.error(error);
              this.presentToast('Ocorreu um erro ao cancelar o agendamento. Por favor, tente novamente.');
            });
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

  async dateToast() {
    const toast = await this.toastCtrl.create({
      message: 'Data selecionada!',
      duration: 1500,
      position: 'top',
    })
    toast.present();
  }

  //botão de agendamento
  toSchedule() {
    if (this.appointment.services.length === 0 || !this.appointment.barber || !this.appointment.date || !this.appointment.time) {
      this.presentToast('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.firebaseService.addAppointment(this.appointment).then(() => {
      this.presentToast('Agendamento realizado com sucesso!');
    }).catch((error) => {
      this.presentToast('Ocorreu um erro ao realizar o agendamento. Por favor, tente novamente.');
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }

  changePhoto() {
    const dialogRef = this.matDialog.open(UserProfilePage);
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
