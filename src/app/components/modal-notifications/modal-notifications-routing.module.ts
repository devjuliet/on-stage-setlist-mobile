import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalNotificationsPage } from './modal-notifications.page';

const routes: Routes = [
  {
    path: '',
    component: ModalNotificationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalNotificationsPageRoutingModule {}
