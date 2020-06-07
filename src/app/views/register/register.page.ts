import { Component, OnInit } from '@angular/core';
import { DataSessionService } from '../../services/data-session/data-session.service';
import { UtilitiesService } from '../../services/utilities/utilities.service';
import { ApiDataService } from '../../services/api-data/api-data.service';
import { LogedResponse } from '../../classes/logedResponse.class';
import { ServerMessage } from '../../classes/serverMessages.class';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;
  confirmPass: String;
  role: Number;

  constructor(public dataSessionService: DataSessionService, private apiDataService: ApiDataService, 
    private utilitiesService: UtilitiesService) { }

  ngOnInit() {
    this.clearData();
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);
     if (this.dataSessionService.user.type == 0 || this.dataSessionService.user.type == 2 ) {
        this.dataSessionService.navigateByUrl("/dashboard/home");
      }else{
        //Cosas para hacer en la vista
        this.dataSessionService.logOut();
        this.utilitiesService.presentToast( "Usuario invalido.", 4000 );
      }
    }, (noLoginResponse: LogedResponse) => {
      //console.log(noLoginResponse);

    });
  }

  clearData() {
    this.name = "";
    this.email = "";
    this.password = "";
    this.confirmPass = "";
    this.username = "";
    this.role = 0;
  }

  roleChanched(ev: any) {
    this.role = ev.detail.value;
  }

  validateRegisterData(): Boolean {
    if (this.username.length < 8) {
      this.utilitiesService.presentToast("Nombre de usuario debe ser mayor de 8 caracteres.", 2000 );
      return false;
    } else if (this.name == "") {
      this.utilitiesService.presentToast("Nombre no valido.", 2000);
      return false;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email.toString())) { //Validacion del correo
      this.utilitiesService.presentToast( "Correo electronico no valido.", 2000);
      return false;
    } else if (this.password.length < 8) {
      this.utilitiesService.presentToast( "Contraseña debe ser mayor de 8 caracteres.", 2000);
      return false;
    } else if (this.password != this.confirmPass) {
      this.utilitiesService.presentToast( "Por favor confirma su contraseña.", 2000);
      return false;
    } else {
      return true;
    }
  }

  registerUser() {
    if (this.validateRegisterData()) {
      
      //Se setea el typo de perfil que se esta registrando
      this.apiDataService.registerUser(this.name, this.username ,this.email, this.password, this.role).then((response: ServerMessage) => {
        if (response.error == false) {
          this.clearData();
          this.utilitiesService.presentToast( response.message, 3000);
          this.dataSessionService.navigateByUrl("/login");
        } else {
          this.utilitiesService.presentToast(response.message, 3000);
        }
      }, (error) => {
        console.log(error);
        this.utilitiesService.presentToast("A ocurrido un error registrando el usuario", 3000);
      });

    }
  }
}
