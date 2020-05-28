import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalNotificationsPage } from 'src/app/components/modal-notifications/modal-notifications.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalNotificationsPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
}
