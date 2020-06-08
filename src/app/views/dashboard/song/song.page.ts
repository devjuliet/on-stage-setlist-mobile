import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, IonSlides } from '@ionic/angular';
import { ModalNotificationsPage } from '../../../components/modal-notifications/modal-notifications.page';
import { Song } from '../../../classes/repertorieAllData.class';
import { ActivatedRoute } from '@angular/router';
import { DataSessionService } from '../../../services/data-session/data-session.service';
import { UtilitiesService } from '../../../services/utilities/utilities.service';
import { ApiDataService } from '../../../services/api-data/api-data.service';
import { LogedResponse } from '../../../classes/logedResponse.class';
import { SafeUrl } from '@angular/platform-browser';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
  selector: 'app-song',
  templateUrl: './song.page.html',
  styleUrls: ['./song.page.scss'],
})
export class SongPage implements OnInit {

  haveChords : boolean;
  haveTabs : boolean;

  imageChords : SafeUrl;
  imageTabs : SafeUrl;

  sliderOpts : {};

  loadedSong: Song;

  @ViewChild('Slider', { static: false }) slider: IonSlides;
  actualSliderIndex : number;

  params : any;

  constructor(public modalController: ModalController, private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,public dataSessionService: DataSessionService, private utilitiesService: UtilitiesService
    , private apiDataService: ApiDataService) {
    // userParams is an object we have in our nav-parameters
    this.loadedSong = new Song();
    this.imageChords = "";
    this.imageTabs = "";
    this.actualSliderIndex = 0;
    this.sliderOpts = {
      initialSlide: this.actualSliderIndex,
      speed: 400,
      allowTouchMove : false,
      zoom : true
    };
    this.haveChords = false;
    this.haveTabs = false;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params) => {
      this.params = params;
      this.reloadDataPage();
    });
    
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalNotificationsPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  goBack() { 
    this.dataSessionService.navigateByUrl('/dashboard/list/'+this.params.idLiveEvent+'/'+
      this.params.idSet);
  }

  moveSlide(){
    this.slider.slideTo(this.actualSliderIndex);
  }

  reloadDataPage(){
    this.loadedSong = new Song();
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);  
      //console.log("init login respuesta");
      //Listo para la integracion de la migracion con el type 1 que es el typo manager  
      if (this.dataSessionService.user.type == 2 || this.dataSessionService.user.type == 0) {
        //Cosas para hacer en caso de que el usuario este actualmente logeado
        this.dataSessionService.getAllDataEvents(async (okMessage) => {
          
            //console.log('Params: ', params);
            //console.log(this.dataSessionService.nextEventsAllData);
            
            let eventFindedSet = this.dataSessionService.nextEventsAllData.find((event) => {
              return event.idLiveEvent == parseInt(this.params.idLiveEvent.toString());
            });

            let setFinded = eventFindedSet.setlist.sets.find((set) => {
              return set.idSet == parseInt(this.params.idSet.toString());
            });

            this.loadedSong = setFinded.songs.find((song) => {
              return song.idSong == parseInt(this.params.idSong.toString());
            });
            //console.log(this.dataSessionService.user);
            
            //Vocalista,Teclado,Bajo,Guitarra
            switch (this.dataSessionService.user.role.toString()) {
              case '0'://Vocalista
                
                break;
              case '1'://Teclado
                this.haveChords = this.loadedSong.chordsPiano;
                this.haveTabs = this.loadedSong.tabPiano;
                if (this.haveChords == true) {
                  this.imageChords = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
                    'uploads/song-image/' + this.loadedSong.idSong.toString() + '/piano-chords');
                }
                if (this.haveTabs == true) {
                  this.imageTabs = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
                    'uploads/song-image/' + this.loadedSong.idSong.toString() + '/piano-tabs');
                }
                break;
              case '2'://Bajo
                this.haveChords = this.loadedSong.chordsBass;
                this.haveTabs = this.loadedSong.tabBass;
                if (this.haveChords == true) {
                  this.imageChords = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
                    'uploads/song-image/' + this.loadedSong.idSong.toString() + '/bass-chords');
                }
                if (this.haveTabs == true) {
                  this.imageTabs = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
                    'uploads/song-image/' + this.loadedSong.idSong.toString() + '/bass-tabs');
                }
                break;
              case '3'://Guitarra
                this.haveChords = this.loadedSong.chordsGuitar;
                this.haveTabs = this.loadedSong.tabGuitar;
                if (this.haveChords == true) {
                  this.imageChords = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
                    'uploads/song-image/' + this.loadedSong.idSong.toString() + '/guitar-chords');
                }
                if (this.haveTabs == true) {
                  this.imageTabs = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
                    'uploads/song-image/' + this.loadedSong.idSong.toString() + '/guitar-tabs');
                }
                break;
              default:
              
                break;
            }
            if(this.dataSessionService.user.role != 0){
              this.slider.slideTo(1);
              this.actualSliderIndex = 1;
            }
            //console.log(this.loadedSong);
            //console.log(this.haveChords);
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

  loadNext(){
    let eventFindedSet = this.dataSessionService.nextEventsAllData.find((event) => {
      return event.idLiveEvent == parseInt(this.params.idLiveEvent.toString());
    });

    let setFinded = eventFindedSet.setlist.sets.find((set) => {
      return set.idSet == parseInt(this.params.idSet.toString());
    });

    let indexActualSong = setFinded.songs.findIndex((song) => {
      return song.idSong == parseInt(this.params.idSong.toString());
    });
    
    if((indexActualSong + 1) == setFinded.songs.length){
      this.utilitiesService.presentToast("Estas en la ultima cancion de la lista",3000);
    }else{
      this.dataSessionService.navigateByUrl('/dashboard/song/'+this.params.idLiveEvent+'/'+
        this.params.idSet+'/'+setFinded.songs[indexActualSong + 1].idSong);
    }
  }

  loadPrevious(){
    let eventFindedSet = this.dataSessionService.nextEventsAllData.find((event) => {
      return event.idLiveEvent == parseInt(this.params.idLiveEvent.toString());
    });

    let setFinded = eventFindedSet.setlist.sets.find((set) => {
      return set.idSet == parseInt(this.params.idSet.toString());
    });

    let indexActualSong = setFinded.songs.findIndex((song) => {
      return song.idSong == parseInt(this.params.idSong.toString());
    });
    
    if((indexActualSong - 1) < 0 ){
      this.utilitiesService.presentToast("Estas en la primera cancion de la lista",3000);
    }else{
      this.dataSessionService.navigateByUrl('/dashboard/song/'+this.params.idLiveEvent+'/'+
        this.params.idSet+'/'+setFinded.songs[indexActualSong - 1].idSong);
    }
  }
}
