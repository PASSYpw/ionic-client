import {Component} from "@angular/core";
import {AlertController, ViewController} from "ionic-angular";
import {passy, stPassy} from "../../app/app.component";
import {Http} from "@angular/http";
import {isCordovaAvailable, Passy} from "../../app/Passy";
import {TouchID} from '@ionic-native/touch-id';
import {Storage} from "@ionic/storage";
import { LoadingController } from 'ionic-angular';


@Component({
    templateUrl: 'login-page.html'
})
export class LoginPage {

    private username;
    private password;
    private target = 'https://app.passy.pw/action.php';


    constructor(public viewCtrl: ViewController, public http: Http, private touchId: TouchID, public storage: Storage, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {


        console.log("called 1")
    }


    public tryLogin() {

        stPassy(new Passy(this.target));
        const me = this;
        let loader = this.loadingCtrl.create({
            content: "Login in",
            duration: 60000
        });
        loader.present();
        passy.tryLogin(this.username, this.password, this.http, function (succeeded) {
            loader.dismissAll();
            if (succeeded) {
                if(isCordovaAvailable())  {
                    me.storage.keys().then(keys => {


                        if (keys.indexOf("touch_dismiss") == -1) {

                            let confirm = me.alertCtrl.create({
                                title: 'Save for touch id?',
                                message: 'Do you want to be able to login with touch id?',
                                buttons: [{
                                    text: 'Disagree',
                                    handler: () => {
                                        me.storage.set("touch_dismiss", true).then(_ => {
                                            me.dismiss()

                                        });

                                    }
                                },
                                    {
                                        text: 'Agree',
                                        handler: () => {
                                            me.storage.set("touch_save", true).then(_ => {
                                                me.storage.set("touch_user", me.username).then(_ => {
                                                    me.storage.set("touch_pass", me.password).then(_ => {
                                                        me.dismiss();
                                                    });
                                                });
                                            });
                                        }
                                    }]
                            });
                            confirm.present();
                        } else {
                            me.dismiss()

                        }

                    });

                } else {
                    me.dismiss();
                }
            }

        }, loader);
    }

    ionViewDidLoad() {


        if(!isCordovaAvailable()) return;
        console.log("called 2");
        const it = this;
        this.storage.keys().then(keys => {
            if (keys.indexOf("touch_save") != -1) {

                it.touchId.isAvailable()
                    .then(_ => {
                            it.touchId.verifyFingerprint('Verify the Touch setup')
                                .then(
                                    res => {
                                        it.storage.get("touch_user").then(username => {
                                            it.storage.get("touch_pass").then(pass => {
                                                let loader = it.loadingCtrl.create({
                                                    content: "Login in",
                                                    duration: 60000
                                                });
                                                loader.present();
                                                stPassy(new Passy(this.target));
                                                passy.tryLogin(username, pass, it.http, function (succeeded) {
                                                    if (succeeded) {
                                                        loader.dismissAll();
                                                        it.dismiss()
                                                    }
                                                });
                                            })
                                        })
                                    },
                                    err => console.error('Error', err)
                                );
                        },
                        err => console.error('TouchID is not available', err)
                    );
            }
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
