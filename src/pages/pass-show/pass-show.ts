import {Component} from "@angular/core";
import {NavParams, ToastController} from "ionic-angular";
import { Clipboard } from '@ionic-native/clipboard';
import {popAlert} from "../tabs/tabs";

@Component({
  selector: 'pass-show',
  templateUrl: 'pass-show.html'
})

export class PassShow {

  private password;
  private passwordInfo;


  constructor(private navParams: NavParams, private clipboard: Clipboard, private toast:ToastController) {


    this.password = navParams.data.password;
    this.passwordInfo = navParams.data.passInf;

  }
  copy() {
      this.clipboard.copy(this.password);
      let toast = this.toast.create({
          message: "Copied",
          duration: 2500,
          position: 'bottom'
      });
      toast.present();
  }

}
