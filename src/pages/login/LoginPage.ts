import {Component} from "@angular/core";
import {ViewController} from "ionic-angular";
import {passy} from "../../app/app.component";
import {Http} from "@angular/http";
@Component({
  templateUrl: 'login-page.html'
})
export class LoginPage {

  private username;
  private password;
  constructor(public viewCtrl: ViewController,public http:Http) {

  }

  public tryLogin()  {

    const me = this;
    passy.tryLogin(this.username, this.password, this.http, function (succeeded) {

     if(succeeded) {
       me.dismiss()
     }

    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
