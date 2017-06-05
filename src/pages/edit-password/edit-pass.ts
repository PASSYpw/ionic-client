import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {passy} from "../../app/app.component";
import {NavParams, ViewController} from "ionic-angular";
@Component({
    selector: 'new-pass',
    templateUrl: 'edit-pass.html'
})

export class EditPassPage  {

    private id;
    private username;
    private password;
    private description;

    constructor(public viewCtrl: ViewController,public http:Http, private navParams: NavParams) {

        this.id = navParams.data.password.data.password_id;
        this.username = navParams.data.password.data.username;
        this.password = navParams.data.password.pass;
        this.description = navParams.data.password.data.description;


    }
    save() {

        const me = this;

        passy.editPassword(this.id,this.username,this.password, this.description, this.http, function (data) {

            if(!data.success) {

            } else {
                me.viewCtrl.dismiss();
            }

        });

    }


}
