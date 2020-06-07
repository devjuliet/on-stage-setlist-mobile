import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ModalNotificationsPage } from './../../../components/modal-notifications/modal-notifications.page'
import { ActivatedRoute } from '@angular/router';
import { DataSessionService } from '../../../services/data-session/data-session.service';
import { UtilitiesService } from '../../../services/utilities/utilities.service';
import { ApiDataService } from '../../../services/api-data/api-data.service';
import { LogedResponse } from '../../../classes/logedResponse.class';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(public modalController: ModalController, private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,public dataSessionService: DataSessionService, public utilitiesService: UtilitiesService
    , private apiDataService: ApiDataService) {
      
    }

  ngOnInit() {
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);  
      //console.log("init login respuesta");
      //Listo para la integracion de la migracion con el type 1 que es el typo manager  
      if (this.dataSessionService.user.type == 2 || this.dataSessionService.user.type == 0) {
        //Cosas para hacer en caso de que el usuario este actualmente logeado
        this.dataSessionService.getHistoryUser((okMessage)=>{
          //console.log(this.dataSessionService.userHistory);
          if(this.dataSessionService.user.haveImage == true){
            this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
              'uploads/user-image/' + this.dataSessionService.user.idUser.toString()).then((image) => {
                this.dataSessionService.user.imageBlob = image;
              //Cosas para hacer despues de cargar la imagen
  
            }, (error) => {
              console.log(error);
               this.dataSessionService.user.imageBlob = "";
               this.utilitiesService.presentToast("a ocurrido un error obteniendo la imgen del perfil",3000);
            });
          }
        },(errorMessage)=>{
          console.log(errorMessage);
          this.utilitiesService.presentToast(errorMessage,3000);
        });
      }else{
        this.dataSessionService.logOut();
        this.utilitiesService.presentToast( "Usuario invalido.", 4000);
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

  reloadDataPage(){
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);
      if (this.dataSessionService.user.type == 0 || this.dataSessionService.user.type == 2) {
        //Cosas para hacer si el usuario es correcto
        this.dataSessionService.getHistoryUser((okMessage)=>{
          //console.log(this.dataSessionService.userHistory);
          if(this.dataSessionService.user.haveImage == true){
            this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
              'uploads/user-image/' + this.dataSessionService.user.idUser.toString()).then((image) => {
                this.dataSessionService.user.imageBlob = image;
              //Cosas para hacer despues de cargar la imagen
  
            }, (error) => {
              console.log(error);
               this.dataSessionService.user.imageBlob = "";
               this.utilitiesService.presentToast("a ocurrido un error obteniendo la imgen del perfil",3000);
            });
          }
        },(errorMessage)=>{
          console.log(errorMessage);
          this.utilitiesService.presentToast(errorMessage,3000);
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
