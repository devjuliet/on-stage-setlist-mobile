import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor(public toastController: ToastController,) { }

  //TOAST
  async presentToast(message : string,time : number) {
    const toast = await this.toastController.create({
      message: message,
      duration: time,
      position: 'top'
    });
    toast.present();
  }

  async presentToastWithOptions(title : string,message : string,time : number) {
    const toast = await this.toastController.create({
      header: title,
      message: message,
      position: 'top',
      duration: time
    });
    toast.present();
  }

  getOnlyDate(string){
    let fixMont = new Date(string).getUTCMonth().toString().length == 1 ? "0"+new Date(string).getUTCMonth() : new Date(string).getUTCMonth();
    return "" + new Date(string).getFullYear() + "-" + fixMont + "-" + new Date(string).getDate();
  }

  getOnlyTime(string){
    const birthday = new Date(string);
    let fixMin = birthday.getMinutes().toString().length == 1 ? "0"+birthday.getMinutes() : birthday.getMinutes();
    return "" + birthday.getHours() + ":" + fixMin ;
  }
}
