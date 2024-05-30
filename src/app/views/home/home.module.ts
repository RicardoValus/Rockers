import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { MatListModule } from '@angular/material/list';
import { MatListItemTitle } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MatListModule,
    MatListItemTitle,
    ReactiveFormsModule,
    MatRippleModule

  ],
  declarations: [HomePage]
})
export class HomePageModule { }
