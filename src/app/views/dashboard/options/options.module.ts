import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OptionsPageRoutingModule } from './options-routing.module';

import { OptionsPage } from './options.page';

import { ExploreContainerComponentModule } from '../../../explore-container/explore-container.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OptionsPageRoutingModule,
    ExploreContainerComponentModule
  ],
  declarations: [OptionsPage]
})
export class OptionsPageModule {}
