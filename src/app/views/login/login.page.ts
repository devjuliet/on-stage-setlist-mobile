import { Component, OnInit } from '@angular/core';
import { DataSessionService } from '../../services/data-session/data-session.service';
import { UtilitiesService } from '../../services/utilities/utilities.service';
import { LogedResponse } from '../../classes/logedResponse.class';
import { ServerMessage } from '../../classes/serverMessages.class';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string;
  password: string;

  constructor(private dataSessionService : DataSessionService, private utilitiesService: UtilitiesService) { }


  ngOnInit() {
    this.clearData();
    //console.log("init login");
    
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);  
      //console.log("init login respuesta");
      //Listo para la integracion de la migracion con el type 1 que es el typo manager  
      if (this.dataSessionService.user.type == 2 || this.dataSessionService.user.type == 0) {
        //Cosas para hacer en caso de que el usuario este actualmente logeado
        this.dataSessionService.navigateByUrl("/dashboard/home");

        
      }else{
        this.dataSessionService.logOut();
        this.utilitiesService.presentToast( "Usuario invalido.", 4000);
      }
    }, (noLoginResponse: LogedResponse) => {
      //console.log(noLoginResponse);
    });
  }

  clearData() {
    //this.username = "lupillos.musica";
    //this.password = "lupillos.musica";
    this.username = "lajenyandrea";
    this.password = "lajenyandrea";
  }

  validateLoginData(): Boolean {
    if (this.username.length < 8) {
      this.utilitiesService.presentToast( "Usuario invalido.", 4000 );
      return false;
    } else if (this.password.length < 8) {
      this.utilitiesService.presentToast( "Contraseña invalida.", 4000 );
      return false;
    } else {
      return true;
    }
  }

  loginUser() {
    if (this.validateLoginData()) {
      this.dataSessionService.loginUser(this.username, this.password).then((response: ServerMessage) => {
        //console.log(response);
        this.clearData();
        if (response.data.user.type == 2 || response.data.user.type == 0) {
          //Cosas para hacer en caso de que el usuario se loguee correctamente
          this.utilitiesService.presentToast( "Inicio exitoso", 2000 );
          this.dataSessionService.navigateByUrl("/dashboard/home");
        }else{
          this.utilitiesService.presentToast( "Usuario invalido", 2000 );
          this.dataSessionService.logOut();
        }
      }, (error) => {
        //console.log(error);
        this.utilitiesService.presentToast( error.message, 4000 );
      });
    }
  }
  
}
