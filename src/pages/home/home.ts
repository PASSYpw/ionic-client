import { Component } from '@angular/core';
import {ActionSheetController, ModalController, NavController, PopoverController, Tabs} from 'ionic-angular';
import {Http} from "@angular/http";
import {passwords} from "../../app/Passy";
import {passy} from "../../app/app.component";
import {PassShow} from "../pass-show/pass-show";
import {NewPassPage} from "../new-password/new-pass";
import {EditPassPage} from "../edit-password/edit-pass";



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

    const me = this;
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Edit or achive this password',
      buttons: [
        {
          text: 'Edit',
          handler: () => {
            const id = value.password_id;
            passy.getPassword(id, this.http, function (password) {
              let popover = me.modalCtrl.create(EditPassPage, {
                password: {data: value, pass: password}
              });
              popover.present({
              });
            });

          }
        },{
          text: 'Delete',
          handler: () => {
            passy.archive(me.http, value.password_id, function (data) {


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
  public showPass(id, password) {

    const me = this;
    passy.getPassword(id, this.http, function (pass) {

      let popover = me.popoverCtrl.create(PassShow, {
        passInf: password,
        password: pass
      });

      popover.present({

      });
    })

  }


}
