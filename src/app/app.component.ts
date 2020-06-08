import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  showSplash : boolean = true;
  splash = true;
  

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.awaitTime(2000,()=>{
        this.showSplash = false;
      })
    });
  }

  async awaitTime(ms, callback) {
    this.sleep(ms).finally(() => {
      callback();
    })
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
