import { Component } from '@angular/core';
import {NavController, PopoverController, Tabs} from 'ionic-angular';
import {Http} from "@angular/http";
import {passwords} from "../../app/Passy";
import {passy} from "../../app/app.component";
import {PassShow} from "../pass-show/pass-show";



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  get passwords() {
    return passwords;
  }

  constructor(public popoverCtrl: PopoverController, public navCtrl: NavController, private http: Http) {



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
