import { Component } from '@angular/core';
import {LoginPage} from '../login/LoginPage';
import { HomePage } from '../home/home';
import {ModalController, NavController, PopoverController} from "ionic-angular";
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabs = [{title: "Passwords", site: HomePage, icon: "home"}];



  constructor(public modalCtrl: ModalController) {

    let popover = this.modalCtrl.create(LoginPage)
    popover.present({
    });
  }


}
