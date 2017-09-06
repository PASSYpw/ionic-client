import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {passy} from "../../app/app.component";
import {ViewController} from "ionic-angular";
import {randomPassword} from "../../app/Passy";
@Component({
    selector: 'new-pass',
    templateUrl: 'new-pass.html'
})

export class NewPassPage {

    private username;
    private password;
    private description;

    constructor(public viewCtrl: ViewController,public http:Http) {}
    cancel() {
        this.viewCtrl.dismiss();
    }

    randomPass() {
        this.password = randomPassword(15);
    }
    newPass() {

        const me = this;
        passy.addPassword(this.http, this.username, this.password, this.description, function (data) {

            if(!data.success) {

            } else {
                me.viewCtrl.dismiss();
            }
        });

    }


}
