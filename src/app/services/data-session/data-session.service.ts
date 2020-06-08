import { Injectable } from '@angular/core';
import { User } from '../../classes/user.class';
import { ApiDataService } from '../api-data/api-data.service';
import { UtilitiesService } from '../utilities/utilities.service';
import { Storage } from '@ionic/storage';
import { ServerMessage } from '../../classes/serverMessages.class';
import { Router } from '@angular/router';
import { LogedResponse } from '../../classes/logedResponse.class';
import { RepertoriesAllData } from '../../classes/repertorieAllData.class';

@Injectable({
  providedIn: 'root'
})
export class DataSessionService {
  token: String;
  user: User;
  baseURL: String;

  nextEventsAllData : RepertoriesAllData[];
  eventSelected : RepertoriesAllData;
  
  userHistory : [];
  constructor(
    private apiDataService: ApiDataService,
    private utilitiesService : UtilitiesService,
    private storage: Storage,
    private router: Router) 
    { 

    this.token = "";
    this.user = new User();
    this.baseURL = apiDataService.baseURL;
    this.nextEventsAllData = [];
    this.eventSelected = new RepertoriesAllData();
    this.userHistory = [];
    //Esto ocurre cada que se crea este servicio en cada una de las vistas
    //storage.remove('token');
    storage.get('token').then((token)=>{
      if (token == null) {
        storage.set('token', this.token+"").then(
          () => {
            console.log("Primer uso")
          },(error) => {
            this.utilitiesService.presentToast("Error iniciando storage",4000);
          }
        );
      } else {
        this.token = token;
        //console.log(this.token);
        //Acciones a realizar cuando el token estaba ya guardado pero la data para la interfaz no esta disponible
        //Se sabe que no esta disponible porque apenas se mando llamar el contructor
        if(this.token.length > 3){
          //Cosas por hacer en caso de que el token exista que es lo mismo que tener la sesion guardada
          this.apiDataService.setToken(this.token);
          console.log("con sesion");
          this.apiDataService.getUserData(this.token).then((response: ServerMessage) => {
            //console.log(response);
            if (response.error == false) {
              this.user.idUser = response.data.user.idUser;
              this.user.username = response.data.user.username;
              this.user.name = response.data.user.name;
              this.user.type = response.data.user.type;
              this.user.email = response.data.user.email;
              this.user.haveImage = response.data.user.haveImage;
              this.user.role = response.data.user.role;
              this.user.description = response.data.user.description;
  
              if (this.user.type == 0 || this.user.type == 2) {
                //Cuando el usuario es valido
                //console.log("usuario valido");
                
              } else {
                //cuando el usuario no es valido
                this.navigateByUrl("/login");
              }
              /* console.log(this.user); */
            } else {
              //Cosas para hacer cuando la sesion es invalida
              this.navigateByUrl("/login");
              console.log(response);
            }
          }, (error) => {
            //Cuando ocurre un error solicitando la data al server
            this.utilitiesService.presentToast("Error obteniendo el usuario",4000);
            this.navigateByUrl("/login");
            console.log(error);
          });
          
        }else{
          this.navigateByUrl("/login");
          console.log("sin sesion");
        }
      }
    },(error)=>{
      this.utilitiesService.presentToast("Error obteniendo el usuario de la cache",4000);
      this.navigateByUrl("/login");
      console.log("error");
    });
  }

  navigateByUrl(url : string){
    this.router.navigate([url])
  }

  async checkLogin(succesCallBack, errorCallBack) {
    //console.log(this.token);
    this.token = JSON.parse(JSON.stringify(await this.storage.get('token')));
    //console.log(JSON.parse(JSON.stringify(this.storage.get('token'))));
    if (this.token == "") {
      errorCallBack(new LogedResponse(true, "Sin token"))
    } else {
      this.apiDataService.setToken(this.token);
      //console.log(this.user);
      
      if (this.user.username == "") {
        this.apiDataService.getUserData(this.token).then((response: ServerMessage) => {
          //console.log(response);
          if (response.error == true) {
            this.navigateByUrl("/login");
            errorCallBack(new LogedResponse(false, response.message))
          } else {
            this.user.idUser = response.data.user.idUser;
            this.user.username = response.data.user.username;
            this.user.name = response.data.user.name;
            this.user.type = response.data.user.type;
            this.user.email = response.data.user.email;
            this.user.haveImage = response.data.user.haveImage;
            this.user.role = response.data.user.role;
            this.user.description = response.data.user.description;

            if (this.user.haveImage) {
              this.apiDataService.getImage(this.baseURL.toString() +
                'uploads/user-image/' + this.user.idUser.toString()).then((image) => {
                  this.user.imageBlob = image;
                  succesCallBack(new LogedResponse(false, "Con token y usario actualizado"));
                  //console.log(this.user);
                }, (error) => {
                  console.log(error);
                  this.user.imageBlob = "";
                  errorCallBack(new LogedResponse(true, "A ocurrido un error obteniendo la imagen del usuario"));
                });
            } else {
              succesCallBack(new LogedResponse(false, "Con token y usario actualizado"));
              //console.log(this.user);
            }
            /* console.log(this.user); */
          }
        }, (error) => {
          console.log(error);
          errorCallBack(new LogedResponse(true, "A ocurrido un error"));
        });
      } else {
        if(this.user.haveImage == true){
          if(this.user.imageBlob==""){
            this.apiDataService.getImage(this.baseURL.toString() +
            'uploads/user-image/' + this.user.idUser.toString()).then((image: string) => {
              this.user.imageBlob = image;
              //console.log(image);
              succesCallBack(new LogedResponse(false, "Sesion Con token e informacion de usuario"));
            }, (error) => {
              console.log(error);
              this.user.imageBlob = "";
              errorCallBack(new LogedResponse(true, "A ocurrido un error obteniendo la imagen del usuario"));
            });
          }else{
            succesCallBack(new LogedResponse(false, "Sesion Con token e informacion de usuario"));
          }
        }else{
          succesCallBack(new LogedResponse(false, "Sesion Con token e informacion de usuario"));
        }
      }
    }
  }

  logOut() {
    this.storage.set('token', "");
    this.token = "";
    this.user = new User();
    this.nextEventsAllData = [];
    this.eventSelected = new RepertoriesAllData();
    this.userHistory = [];
    this.navigateByUrl('/login');
  }

  loginUser(username: String, password: String) {
    return new Promise((resolve, reject) => {
      this.apiDataService.doLogin(username, password).then((response: ServerMessage) => {
        if (response.error == false) {
          //this.utilitiesService.presentToast("Iniciando sesion",2000);
          //Logica con la que guardamos los datos del inicio de sesion
          this.storage.set('token', response.data.token+"").then(
            () => {
              console.log("Inicio de sesion correcto");
              this.token = response.data.token;
              this.apiDataService.setToken(this.token);
            },(error) => {
              this.utilitiesService.presentToast("Error guardando storage",4000);
            }
          );
          resolve(response)
        } else {
          reject(response);
        }
      }, (error) => {
        reject(error)
      });
    });
  }

  getAllDataEvents(succesCallBack,errorCallBack){
    this.apiDataService.getNextEvents().then((response: ServerMessage) => {
      //console.log(response);
      
      if(response.error == false){
        this.nextEventsAllData = response.data;
        //console.log(this.nextEventsAllData);
        succesCallBack("Proximos eventos obtenidos con exito.");
      }else{
        errorCallBack(response.message);
      }
    }, (error) => {
      console.log(error);
      errorCallBack("A ocurrido un error obteniendo los proximos eventos");
    });
  }

  getHistoryUser(succesCallBack,errorCallBack){
    this.apiDataService.getHistoryUser().then((response: ServerMessage) => {
      
      if(response.error == false){
        this.userHistory = response.data;
        succesCallBack("Historial del usuario obtenido con exito.");
      }else{
        errorCallBack(response.message);
      }
    }, (error) => {
      console.log(error);
      errorCallBack("A ocurrido un error obteniendo el historial del usuario");
    });
  }
}
