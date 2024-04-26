import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FirebaseService } from 'src/app/models/services/firebase/firebase.service';


interface Barber {
  id: string;
  name: string;
  avatar: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  @Output() horarioSelecionado = new EventEmitter<string>();

  horarios: string[] = [];
  novoHorario: string = '';
  horarioSelecionadoValue: string = '';
  barbers: Barber[] = [];

  selectedBarber: Barber | null = null;

  showAddBarber: boolean = false;
  newBarberName: string = '';
  newBarberAvatar: string = '';
  showCalendar: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private firebaseService: FirebaseService,
    private firestore: AngularFirestore
  ) { }

  ngOnInit() {
    this.loadBarbers();
  }

  ionViewWillEnter() {
    this.loadBarbers();
  }

  loadBarbers() {
    this.firebaseService.getBarbers().subscribe((res: any[]) => {
      this.barbers = res.map(barber => {
        const id = barber.id;

        return {
          id: id,
          name: barber.barberName,
          avatar: barber.barberAvatar,
        } as Barber;
      });
    });
  }




  toggleAddBarber() {
    this.showAddBarber = !this.showAddBarber;
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result as string;
      const base64Image = dataURL.split(',')[1];
      this.newBarberAvatar = base64Image;
    };
    reader.readAsDataURL(file);
  }



  async addBarber() {
    if (this.newBarberName && this.newBarberAvatar) {
      try {
        const barberId = await this.firebaseService.addBarber(
          this.newBarberName,
          this.newBarberAvatar.toString()
        );

        this.barbers.push({
          id: barberId,
          name: this.newBarberName,
          avatar: this.newBarberAvatar
        });

        this.newBarberName = '';
        this.newBarberAvatar = '';
        this.toggleAddBarber();
      } catch (error) {
        console.error('Erro ao adicionar barbeiro:', error);
      }
    }
  }


  removeBarber() {

  }



  toggleCalendar() {
    setTimeout(() => {
      this.showCalendar = !this.showCalendar;
    });
  }

  closeCalendar() {
    this.showCalendar = false;
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString();
  }



  selectBarber(barber: Barber) {
    this.selectedBarber = barber === this.selectedBarber ? null : barber;
  }

  selecionarHorarios(event: any) {
    const horariosSelecionados = event.detail.value;
    this.horarios = horariosSelecionados;
  }
  removerHorario(index: number) {
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
}
