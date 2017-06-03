import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
@Component({
  selector: 'pass-show',
  templateUrl: 'pass-show.html'
})

export class PassShow {

  private password;
  private passwordInfo;


  constructor(private navParams: NavParams) {


    this.password = navParams.data.password;
    this.passwordInfo = navParams.data.passInf;

  }

}
