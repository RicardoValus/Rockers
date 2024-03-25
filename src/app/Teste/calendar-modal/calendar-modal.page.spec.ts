import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarModalPage } from './calendar-modal.page';

describe('CalendarModalPage', () => {
  let component: CalendarModalPage;
  let fixture: ComponentFixture<CalendarModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CalendarModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
