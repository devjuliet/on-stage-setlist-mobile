import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalNotificationsPage } from '../../../components/modal-notifications/modal-notifications.page';
import { DataSessionService } from '../../../services/data-session/data-session.service';
import { UtilitiesService } from '../../../services/utilities/utilities.service';
import { LogedResponse } from '../../../classes/logedResponse.class';
import { RepertoriesAllData } from '../../../classes/repertorieAllData.class';
import { ApiDataService } from '../../../services/api-data/api-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public modalController: ModalController, public dataSessionService: DataSessionService,
    public utilitiesService: UtilitiesService, private apiDataService: ApiDataService) { }

  ngOnInit() {
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);
      if (this.dataSessionService.user.type == 0 || this.dataSessionService.user.type == 2) {
        //Cosas para hacer si el usuario es correcto
        this.dataSessionService.getAllDataEvents((okMessage) => {

        }, (errorMessage) => {

        });
      } else {
        //Cosas para hacer en la vista
        this.dataSessionService.logOut();
        this.utilitiesService.presentToast("Usuario invalido.", 4000);
      }
    }, (noLoginResponse: LogedResponse) => {
      //console.log(noLoginResponse);

    });
  }

  reloadDataPage(){
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      console.log(logedResponse);
      if (this.dataSessionService.user.type == 0 || this.dataSessionService.user.type == 2) {
        //Cosas para hacer si el usuario es correcto
        this.dataSessionService.getAllDataEvents((okMessage) => {

        }, (errorMessage) => {

        });
      } else {
        //Cosas para hacer en la vista
        this.dataSessionService.logOut();
        this.utilitiesService.presentToast("Usuario invalido.", 4000);
      }
    }, (noLoginResponse: LogedResponse) => {
      //console.log(noLoginResponse);

    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalNotificationsPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  async openRepertorieOfTheEvent(event: RepertoriesAllData) {
    this.dataSessionService.eventSelected = new RepertoriesAllData();
    if (event.setlist != null) {
      this.dataSessionService.eventSelected = event;
      this.dataSessionService.navigateByUrl("/dashboard/sets-lists")
    } else {
      this.utilitiesService.presentToast("El evento no cuenta con un repertorio por el momento.", 2000);
    }

  }
}
