import { Component } from '@angular/core';
import {ActionSheetController, ModalController, NavController, PopoverController, Tabs} from 'ionic-angular';
import {Http} from "@angular/http";
import {archived} from "../../app/Passy";
import {passy} from "../../app/app.component";
import {PassShow} from "../pass-show/pass-show";
import {NewPassPage} from "../new-password/new-pass";
import {EditPassPage} from "../edit-password/edit-pass";



@Component({
  selector: 'page-home',
  templateUrl: 'archive.html'
})
export class ArchivePage {

  get passwords() {
    return archived;
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

    const me = this;
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Restore or delete the password',
      buttons: [
        {
          text: 'Restore',
          handler: () => {
            const id = value.password_id;
            passy.restorePass(me.http, id, function (data) {
              passy.fetchPasswords(me.http);
            })

          }
        },{
          text: 'Delete',
          handler: () => {
           passy.delPass(me.http, value.password_id, function (data) {
             passy.fetchPasswords(me.http);

           })
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {


          }
        }
      ]
    });
    actionSheet.present();
  }


}
