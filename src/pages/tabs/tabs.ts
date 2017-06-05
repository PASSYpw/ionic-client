import { Component } from '@angular/core';
import {LoginPage} from '../login/LoginPage';
import { HomePage } from '../home/home';
import {ModalController, NavController, PopoverController, AlertController} from "ionic-angular";
import {ArchivePage} from "../archived/archive";
export var alertController = null;
export var modalController = null;
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabs = [{title: "Passwords", site: HomePage, icon: "home"},
    {title: "Archive", site: ArchivePage, icon: "home"}];



  constructor(public modalCtrl: ModalController, public alertCtrl: AlertController) {
    alertController = alertCtrl;
    modalController = modalCtrl;
    let popover = this.modalCtrl.create(LoginPage);
    popover.present({
    });
  }


}
export function loginScreen() {
  let popover = modalController.create(LoginPage);
  popover.present({
  });
}
export function popAlert(title, msg) {

  let alert = alertController.create({
    title: title,
    subTitle: msg,
    buttons: ['OK']
  });
  alert.present();
}