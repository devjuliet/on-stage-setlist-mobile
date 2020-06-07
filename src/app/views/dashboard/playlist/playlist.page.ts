import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalNotificationsPage } from '../../../components/modal-notifications/modal-notifications.page';
import { DataSessionService } from '../../../services/data-session/data-session.service';
import { UtilitiesService } from '../../../services/utilities/utilities.service';
import { LogedResponse } from '../../../classes/logedResponse.class';
import { RepertoriesAllData } from '../../../classes/repertorieAllData.class';
import { ApiDataService } from '../../../services/api-data/api-data.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
})
export class PlaylistPage implements OnInit {

  repertoriesAvailable : RepertoriesAllData[];

  constructor( public modalController: ModalController,public dataSessionService : DataSessionService,
    private utilitiesService: UtilitiesService,private apiDataService : ApiDataService) { 
      this.repertoriesAvailable = [];
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

  async selectEvent(){
    //console.log(this.dataSessionService.eventSelected);
    let setsFixed = Array.from(this.dataSessionService.eventSelected.setlist.sets);
    for (let index = 0; index < setsFixed.length; index++) {
      if(setsFixed[index].haveImage == true){
        setsFixed[index].imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
        'uploads/set-image/' + setsFixed[index].idSet.toString());
      }
    }
    this.dataSessionService.eventSelected.setlist.sets = setsFixed;
  }

  reloadDataPage(){
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);
      if (this.dataSessionService.user.type == 0 || this.dataSessionService.user.type == 2) {
        //Cosas para hacer si el usuario es correcto
        this.dataSessionService.getAllDataEvents((okMessage)=>{
          this.repertoriesAvailable = Array.from(
            this.dataSessionService.nextEventsAllData.filter((eventRepertorie)=>{
              return eventRepertorie.setlist != null;
            })
          );
          if (this.dataSessionService.eventSelected.name.length > 0 ) {
            this.selectEvent();
            //console.log("seleccionando");
          }
        },(errorMessage)=>{
          console.log(errorMessage);
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
}
