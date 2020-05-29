import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalNotificationsPage } from 'src/app/components/modal-notifications/modal-notifications.page';

@Component({
  selector: 'app-songlist',
  templateUrl: './songlist.page.html',
  styleUrls: ['./songlist.page.scss'],
})
export class SonglistPage implements OnInit {

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
