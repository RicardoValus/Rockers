import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/models/services/firebase/firebase.service';

interface Barber {
  id: string;
  barberName: string;
  barberAvatar: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit, OnDestroy {
  @Output() horarioSelecionado = new EventEmitter<string>();

  barbers: any;
  selectedBarber: Barber | null = null;
  showAddBarber: boolean = false;
  newBarberName: string = '';
  newBarberAvatar: string = '';
  image: any;
  barberID: string = ''
  subscriptions: Subscription[] = []

  showCalendar: boolean = false;
  dates: any;



  horarios: string[] = [];
  novoHorario: string = '';
  horarioSelecionadoValue: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private alertCtrl: AlertController,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  ngOnInit() {
    const barberSubscription = this.firebaseService.getBarbers().subscribe(res => {
      this.barbers = res.map(barber => {
        return { id: barber.payload.doc.id, ...barber.payload.doc.data() as any } as any
      })
    })

    const dateSubscription = this.firebaseService.getDates().subscribe(res => {
      this.dates = res.map(date => {
        return { id: date.payload.doc.id, ...date.payload.doc.data() as any } as any
      })
    })
    this.subscriptions.push(barberSubscription, dateSubscription);
  }

  //barbeiros
  toggleAddBarber() {
    this.showAddBarber = !this.showAddBarber;
  }

  async addBarber() {
    this.firebaseService.addBarber(this.newBarberName, this.image);
    // setTimeout(() => { //recarregar pagina depois de 2 segundos
    // location.reload();
    // }, 2000)
  }

  setBarberID(index: number) {
    this.barberID = this.barbers[index].id
    console.log(this.barberID)
  }

  selectBarber(barber: Barber) {
    this.selectedBarber = barber === this.selectedBarber ? null : barber;
  }

  removeBarber() {
    this.firebaseService.removeBarber(this.barberID)
  }

  uploadFile(image: any) {
    this.image = image.files;
  }

  //calendario
  toggleCalendar() {
    setTimeout(() => {
      this.showCalendar = !this.showCalendar;
    });
  }

  async addDate(date: string) {
    try {
      await this.firebaseService.addDate(date);
      const toast = await this.toastCtrl.create({
        message: 'Data desativada com sucesso!',
        duration: 1500,
        position: 'top'
      });
      await toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Esta data já foi desativada.',
        duration: 1500,
        position: 'top',
        // color: 'danger'
      });
      await toast.present();
    }
  }

  deleteDate(dateId: string) {
    this.firebaseService.removeDate(dateId);
    console.log('removido')
  }

  //horários
  selectTime(event: any) {
    const horariosSelecionados = event.detail.value;
    this.horarios = horariosSelecionados;
  }
  removeTime(index: number) {
    this.horarios.splice(index, 1);
  }

  limparHorarios() {
    this.horarios = [];
  }

  horarioOptions = [
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
