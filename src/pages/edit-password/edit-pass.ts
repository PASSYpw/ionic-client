import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {passy} from "../../app/app.component";
import {ViewController} from "ionic-angular";
@Component({
    selector: 'new-pass',
    templateUrl: 'edit-pass.html'
})

export class EditPassPage  {

    private username;
    private password;
    private description;

    constructor(public viewCtrl: ViewController,public http:Http) {



    }
    save() {

        const me = this;

        passy.addPassword(this.http, this.username, this.password, this.description, function (data) {

            if(!data.success) {

            } else {
                me.viewCtrl.dismiss();
            }

        });

    }


}
