import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Barber {
  name: string;
  avatar: SafeUrl | string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  barbers: Barber[] = [
    { name: 'Barbeiro 1', avatar: 'url1' },
  ];

  selectedBarber: Barber | null = null;

  showAddBarber: boolean = false;
  newBarberName: string = '';
  newBarberAvatar: SafeUrl | string = '';
  showCalendar: boolean = false;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  toggleAddBarber() {
    this.showAddBarber = !this.showAddBarber;
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result as string;
      this.newBarberAvatar = this.sanitizer.bypassSecurityTrustUrl(dataURL);
    };
    reader.readAsDataURL(file);
  }

  addBarber() {
    if (this.newBarberName && this.newBarberAvatar) {
      this.barbers.push({ name: this.newBarberName, avatar: this.newBarberAvatar });
      this.newBarberName = '';
      this.newBarberAvatar = '';
      this.toggleAddBarber();
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

  getMinDate(): string {
    const today = new Date();
    return today.toISOString();
  }

  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  };

  removeBarber() {
    if (this.selectedBarber) {
      const index = this.barbers.indexOf(this.selectedBarber);
      if (index !== -1) {
        this.barbers.splice(index, 1);
        this.selectedBarber = null;
      }
    }
  }

  selectBarber(barber: Barber) {
    this.selectedBarber = barber === this.selectedBarber ? null : barber;
  }
}
