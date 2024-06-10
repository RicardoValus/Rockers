import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonSelect, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/models/services/auth/auth.service';
import { FirebaseService } from 'src/app/models/services/firebase/firebase.service';

interface Barber {
  id: string;
  barberName: string;
  barberAvatar: string;
}

interface Appointment {
  services: { name: string, uid: string }[];
  barber: any;
  date: string;
  time: string;
  id: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit, OnDestroy {
  @Output() timeSelected = new EventEmitter<string>();
  @ViewChild('horarioSelect') horarioSelect!: IonSelect;

  barbers: any;
  selectedBarber: Barber | null = null;
  showAddBarber: boolean = false;
  newBarberName: string = '';
  newBarberAvatar: string = '';
  image: any;
  barberID: string = '';
  subscriptions: Subscription[] = [];
  showCalendar: boolean = false;
  dates: any;
  selectedDate!: string;
  times: any;
  newTime: string = '';
  timeSelectedValue: string = '';
  appointments: any;
  loading: boolean = false;

  constructor(
    private firebaseService: FirebaseService,
    private alertCtrl: AlertController,
    private router: Router,
    private toastCtrl: ToastController,
    private authService: AuthService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit() {
    if (!window.location.hash) {
      window.location.hash = 'loaded';
      window.location.reload();
    }

    const barberSubscription = this.firebaseService.getBarbers().subscribe(res => {
      this.barbers = res.map(barber => {
        return { id: barber.payload.doc.id, ...barber.payload.doc.data() as any };
      });
    });

    const dateSubscription = this.firebaseService.getDates().subscribe(res => {
      this.dates = res.map(date => {
        return { id: date.payload.doc.id, ...date.payload.doc.data() as any };
      });
    });

    const timeSubscription = this.firebaseService.getTimes().subscribe(res => {
      this.times = res.map(time => {
        return { id: time.payload.doc.id, ...time.payload.doc.data() as any };
      });
    });

    const appointmentsSubscription = this.firebaseService.getAllAppointments().subscribe(res => {
      this.appointments = res.map(appointment => {
        const appointmentData = appointment.payload.doc.data() as any;
        const id = appointment.payload.doc.id;
        return { id, ...appointmentData } as Appointment;
      });
    });

    this.subscriptions.push(barberSubscription, dateSubscription, timeSubscription, appointmentsSubscription);
  }

  toggleAddBarber() {
    this.showAddBarber = !this.showAddBarber;
  }

  async addBarber() {
    this.firebaseService.addBarber(this.newBarberName, this.image);
    const toast = await this.toastCtrl.create({
      message: 'Barbeiro adicionado com sucesso!',
      duration: 1500,
      position: 'top'
    });
    toast.present();
    this.newBarberName = '';
    this.image = null;
    this.toggleAddBarber();
  }

  setBarberID(index: number) {
    this.barberID = this.barbers[index].id;
    console.log(this.barberID);
  }

  selectBarber(barber: Barber) {
    this.selectedBarber = barber === this.selectedBarber ? null : barber;
  }

  async removeBarber() {
    this.firebaseService.removeBarber(this.barberID);
    const toast = await this.toastCtrl.create({
      message: 'Barbeiro removido com sucesso!',
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }

  uploadFile(image: any) {
    this.image = image.files;
  }

  toggleCalendar() {
    setTimeout(() => {
      this.showCalendar = !this.showCalendar;
    });
  }

  async desativarData() {
    try {
      if (this.selectedDate) {
        const dataFormatada = this.formatarData(this.selectedDate);

        await this.firebaseService.addDate(dataFormatada);

        const toast = await this.toastCtrl.create({
          message: 'Data desativada com sucesso!',
          duration: 1500,
          position: 'top'
        });
        await toast.present();
      } else {
        throw new Error('Por favor, selecione uma data.');
      }
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Esta data já foi desativada.',
        duration: 1500,
        position: 'top'
      });
      await toast.present();
    }
  }

  formatarData(data: string): string {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }

  deleteDate(dateId: string) {
    this.firebaseService.removeDate(dateId);
    console.log('removido');
  }

  async selectTime(event: any) {
    const timesSelected = event.detail.value;
    await this.firebaseService.addTime(timesSelected);
    this.horarioSelect.value = [];
  }

  removeTime(timeId: string) {
    this.firebaseService.removeTime(timeId);
  }

  timeOptions = [
    { value: '08:00', label: '08:00' },
    { value: '08:15', label: '08:15' },
    { value: '08:30', label: '08:30' },
    { value: '08:45', label: '08:45' },
    { value: '09:00', label: '09:00' },
    { value: '09:15', label: '09:15' },
    { value: '09:30', label: '09:30' },
    { value: '09:45', label: '09:45' },
    { value: '10:00', label: '10:00' },
    { value: '10:15', label: '10:15' },
    { value: '10:30', label: '10:30' },
    { value: '10:45', label: '10:45' },
    { value: '11:00', label: '11:00' },
    { value: '11:15', label: '11:15' },
    { value: '11:30', label: '11:30' },
    { value: '11:45', label: '11:45' },
    { value: '12:00', label: '12:00' },
    { value: '12:15', label: '12:15' },
    { value: '12:30', label: '12:30' },
    { value: '12:45', label: '12:45' },
    { value: '13:00', label: '13:00' },
    { value: '13:15', label: '13:15' },
    { value: '13:30', label: '13:30' },
    { value: '13:45', label: '13:45' },
    { value: '14:00', label: '14:00' },
    { value: '14:15', label: '14:15' },
    { value: '14:30', label: '14:30' },
    { value: '14:45', label: '14:45' },
    { value: '15:00', label: '15:00' },
    { value: '15:15', label: '15:15' },
    { value: '15:30', label: '15:30' },
    { value: '15:45', label: '15:45' },
    { value: '16:00', label: '16:00' },
    { value: '16:15', label: '16:15' },
    { value: '16:30', label: '16:30' },
    { value: '16:45', label: '16:45' },
    { value: '17:00', label: '17:00' },
    { value: '17:15', label: '17:15' },
    { value: '17:30', label: '17:30' },
    { value: '17:45', label: '17:45' },
    { value: '18:00', label: '18:00' }
  ];

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
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Sim',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.exitToast();
            this.signOut();
          }
        }
      ]
    });

    await alert.present();
  }

  async exitToast() {
    const toast = await this.toastCtrl.create({
      message: 'Você saiu com sucesso!',
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }

  getServiceNames(services: any[]): string {
    return services.map(service => service.name).join(', ');
  }

  async deleteAppointment(index: number) {
    console.log(this.appointments[index].id);
    const appointmentId = this.appointments[index].id;

    const alert = await this.alertCtrl.create({
      header: 'Deseja cancelar este agendamento?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
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
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }

  async cancelAppointmentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Agendamento cancelado com sucesso!',
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }

  isDateEnabled = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return utcDay !== 0 && date >= today;
  };
}
