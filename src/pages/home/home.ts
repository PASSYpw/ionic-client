import { Component } from '@angular/core';
import {ActionSheetController, ModalController, NavController, PopoverController, Tabs} from 'ionic-angular';
import {Http} from "@angular/http";
import {passwords} from "../../app/Passy";
import {passy} from "../../app/app.component";
import {PassShow} from "../pass-show/pass-show";
import {NewPassPage} from "../new-password/new-pass";



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  get passwords() {
    return passwords;
  }

  constructor(public modalCtrl: ModalController,
              public popoverCtrl: PopoverController,
              public navCtrl: NavController,
              private http: Http,
              public actionSheetCtrl: ActionSheetController) {



  }
  addPass() {

    let popover = this.modalCtrl.create(NewPassPage);
    popover.present({
    });

  }
  public more(value) {

    console.log(value);
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Edit or achive this password',
      buttons: [
        {
          text: 'Edit',
          handler: () => {
            console.log("weo");
          }
        },{
          text: 'Delete',
          handler: () => {
            console.log("weo");

          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log("weo");

          }
        }
      ]
    });
    actionSheet.present();
  }
  public showPass(id, password) {

    const me = this;
    passy.getPassword(id, this.http, function (pass) {

      console.log(pass);
      let popover = me.popoverCtrl.create(PassShow, {
        passInf: password,
        password: pass
      });

      popover.present({

      });
    })

  }


}
