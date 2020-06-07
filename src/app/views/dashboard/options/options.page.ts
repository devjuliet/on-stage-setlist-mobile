import { Component, OnInit } from '@angular/core';
import { DataSessionService } from '../../../services/data-session/data-session.service';
import { UtilitiesService } from '../../../services/utilities/utilities.service';
import { User } from '../../../classes/user.class';
import { LogedResponse } from '../../../classes/logedResponse.class';
import { ApiDataService } from '../../../services/api-data/api-data.service';
import { ServerMessage } from '../../../classes/serverMessages.class';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {

  loadedUserData: User;

  newPassword: string;
  confirmPassword: string;

  constructor(private apiDataService: ApiDataService, public dataSessionService: DataSessionService, private utilitiesService: UtilitiesService) {
    this.loadedUserData = new User();
    this.newPassword = "";
    this.confirmPassword = "";
  }

  ngOnInit() {
    this.reloadOriginalData();
  }

  roleChanched(ev: any) {
    this.loadedUserData.role = ev.detail.value;
  }

  reloadOriginalData() {
    this.loadedUserData = new User();
    this.newPassword = "";
    this.confirmPassword = "";
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);  
      //console.log("init login respuesta");
      //Listo para la integracion de la migracion con el type 1 que es el typo manager  
      if (this.dataSessionService.user.type == 2 || this.dataSessionService.user.type == 0) {
        //Cosas para hacer en caso de que el usuario este actualmente logeado
        this.loadedUserData = JSON.parse(JSON.stringify(this.dataSessionService.user));
        

      } else {
        this.dataSessionService.logOut();
        this.utilitiesService.presentToast("Usuario invalido.", 4000);
      }
    }, (noLoginResponse: LogedResponse) => {
      //console.log(noLoginResponse);
    });
  }

  validateUserData(): Boolean {
    if (this.loadedUserData.name.length < 8) {
      this.utilitiesService.presentToast("Nombre de usuario invalido.", 4000);
      return false;
    } else if (this.loadedUserData.username.length < 8) {
      this.utilitiesService.presentToast("Usuario invalido.", 4000);
      return false;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.loadedUserData.email.toString())) { //Validacion del correo
      this.utilitiesService.presentToast("Correo electronico no valido.", 4000);
      return false;
    } else {
      return true;
    }
  }

  saveData() {
    if (this.newPassword.length > 8 && this.confirmPassword.length > 8 && this.newPassword == this.confirmPassword) {
      this.utilitiesService.presentToast("Actualizando la contraseña", 1000);

      this.apiDataService.changePasswordUser(this.loadedUserData.idUser, this.newPassword).then((response: ServerMessage) => {
        //console.log(response);
        this.utilitiesService.presentToast("Contraseña actualizada.", 3000);
        this.newPassword = "";
        this.confirmPassword = "";
      }).catch((error) => {
        console.log(error);
        this.utilitiesService.presentToast("A ocurrido un error cambiando la contraseña", 3000);
      });
    } else if (this.validateUserData()) {
      this.apiDataService.updateUser(this.loadedUserData).then((response: ServerMessage) => {
        //console.log(response);
        if (response.error == false) {
          this.dataSessionService.user = JSON.parse(JSON.stringify(response.data));
          if (this.dataSessionService.user.haveImage) {
            this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
              'uploads/user-image/' + this.dataSessionService.user.idUser.toString()).then((image) => {
                this.dataSessionService.user.imageBlob = image;
                //console.log(this.user);
              }, (error) => {
                console.log(error);
                this.dataSessionService.user.imageBlob = "";
              });
          }
          this.loadedUserData = JSON.parse(JSON.stringify(this.dataSessionService.user));
        }
        this.utilitiesService.presentToast(response.message, 3000);
      }).catch((error) => {
        this.dataSessionService.user.haveImage = this.loadedUserData.haveImage;
        console.log(error);
        this.utilitiesService.presentToast("Error actualizando informacion del usuario", 4000);
      });

    }
  }

}
