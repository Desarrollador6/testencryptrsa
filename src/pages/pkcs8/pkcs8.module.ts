import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Pkcs8Page } from './pkcs8';

@NgModule({
  declarations: [
    Pkcs8Page,
  ],
  imports: [
    IonicPageModule.forChild(Pkcs8Page),
  ],
})
export class Pkcs8PageModule {}
