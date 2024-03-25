import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-calendar-modal',
  templateUrl: './calendar-modal.page.html',
  styleUrls: ['./calendar-modal.page.scss'],
})
export class CalendarModalPage implements OnInit {

  selectedDateTime!: string;
  showCalendar: boolean = false;

  constructor(private modalController: ModalController) { }

  ngOnInit() { }

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
    return utcDay !== 0 && utcDay !== 6; // 0 para Domingo, 6 para Sábado
  };

}