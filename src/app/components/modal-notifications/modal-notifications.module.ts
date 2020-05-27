import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalNotificationsPageRoutingModule } from './modal-notifications-routing.module';

import { ModalNotificationsPage } from './modal-notifications.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalNotificationsPageRoutingModule
  ],
  declarations: [ModalNotificationsPage]
})
export class ModalNotificationsPageModule {}
