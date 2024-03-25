import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';




@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.page.html',
  styleUrls: ['./appointment.page.scss'],
})
export class AppointmentPage implements OnInit {

  selectedBarber: string | null = null; // Armazena o barbeiro selecionado
  barbers: string[] = ['Barber 1', 'Barber 2', 'Barber 3', 'Barber 4'];
  showCalendar: boolean = false;

  constructor(private modalController: ModalController) {
  }

  ngOnInit() {
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  closeCalendar() {
    this.showCalendar = false;
  }

  selectDateAndClose(event: any) {
    // Lógica para selecionar a data (se necessário)
    console.log('Data selecionada:', event.detail.value);

    // Fechar o toggle
    this.showCalendar = false;
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
    } else if (barber === 'Barber 3') {
      return 'assets/manoguaxi.jpeg';
    } else if (barber === 'Barber 4') {
      return 'assets/manoguaxi.jpeg';
    } else {
      return '';
    }
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString();
  }

  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 7;
  };

}