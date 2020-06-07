import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalNotificationsPage } from '../../../components/modal-notifications/modal-notifications.page';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DataSessionService } from '../../../services/data-session/data-session.service';
import { LogedResponse } from '../../../classes/logedResponse.class';
import { UtilitiesService } from '../../../services/utilities/utilities.service';
import { Set } from './../../../classes/repertorieAllData.class';
import { ApiDataService } from '../../../services/api-data/api-data.service';

@Component({
  selector: 'app-songlist',
  templateUrl: './songlist.page.html',
  styleUrls: ['./songlist.page.scss'],
})
export class SonglistPage implements OnInit {
  loadedSet: Set;
  idEvent :number ;
  constructor(public modalController: ModalController, private activatedRoute: ActivatedRoute,
    private navCtrl: NavController, public dataSessionService: DataSessionService, private utilitiesService: UtilitiesService
    , private apiDataService: ApiDataService) {
    // userParams is an object we have in our nav-parameters
    this.loadedSet = new Set();
    this.idEvent = 0;
  }

  ngOnInit() {
    this.reloadDataPage();
  }
  
  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalNotificationsPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  goBack() {
    this.navCtrl.back();
  }

  reloadDataPage(){
    this.loadedSet = new Set();
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);  
      //console.log("init login respuesta");
      //Listo para la integracion de la migracion con el type 1 que es el typo manager  
      if (this.dataSessionService.user.type == 2 || this.dataSessionService.user.type == 0) {
        //Cosas para hacer en caso de que el usuario este actualmente logeado
        this.dataSessionService.getAllDataEvents( (okMessage) => {
          this.activatedRoute.params.subscribe(async (params) => {
            //console.log('Params: ', params);

            let eventFindedSet = this.dataSessionService.nextEventsAllData.find((event) => {
              return event.idLiveEvent == parseInt(params.idLiveEvent.toString());
            });

            this.loadedSet = eventFindedSet.setlist.sets.find((set) => {
              return set.idSet == parseInt(params.idSet.toString());
            });

            this.idEvent = eventFindedSet.idLiveEvent;
            if (this.loadedSet.haveImage == true) {
              this.loadedSet.imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
                'uploads/set-image/' + this.loadedSet.idSet.toString());
            }
            //console.log(this.loadedSet);
          });
        }, (errorMessage) => {

        });
      } else {
        this.dataSessionService.logOut();
        this.utilitiesService.presentToast("Usuario invalido.", 4000);
      }
    }, (noLoginResponse: LogedResponse) => {
      //console.log(noLoginResponse);
    });
  }
}
