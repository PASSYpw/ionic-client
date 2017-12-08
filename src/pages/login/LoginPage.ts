import {Component} from "@angular/core";
import {AlertController, ViewController} from "ionic-angular";
import {passy, stPassy} from "../../app/app.component";
import {Http} from "@angular/http";
import {isCordovaAvailable, Passy} from "../../app/Passy";
import {TouchID} from '@ionic-native/touch-id';
import {Storage} from "@ionic/storage";
import {LoadingController} from 'ionic-angular';
import {AndroidFingerprintAuth} from "@ionic-native/android-fingerprint-auth";


@Component({
    templateUrl: 'login-page.html'
})
export class LoginPage {

    private username;
    private password;
    private target = 'https://app.passy.pw/action.php';


    constructor(public viewCtrl: ViewController, public http: Http, private touchId: TouchID, public storage: Storage, public alertCtrl: AlertController, public loadingCtrl: LoadingController, private androidFA: AndroidFingerprintAuth) {

        const me = this;
        storage.get("save_url").then(val => {
            if (val != null && val.length > 5) me.target = val;
        })
    }


    public tryLogin() {

        stPassy(new Passy(this.target));
        const me = this;
        let loader = this.loadingCtrl.create({
            content: "Logging in...",
            duration: 60000
        });
        loader.present();
        passy.tryLogin(this.username, this.password, this.http, function (succeeded) {
            loader.dismissAll();
            if (succeeded) {
                me.storage.set("save_url", me.target).then(_ => {
                    if (isCordovaAvailable()) {
                        me.storage.keys().then(keys => {


                            if (keys.indexOf("touch_dismiss") == -1) {

                                me.touchId.isAvailable().then(_ => {
                                    let confirm = me.alertCtrl.create({
                                        title: 'Enable Touch ID Login?',
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
                                                        me.storage.set("touch_info", {
                                                            username: me.username,
                                                            password: me.password
                                                        }).then(_ => {

                                                        });
                                                    });
                                                }
                                            }]
                                    });
                                    confirm.present();
                                }).catch(_ => {

                                    me.androidFA.isAvailable().then(result => {

                                        if (result.isAvailable) {
                                            let confirm = me.alertCtrl.create({
                                                title: 'Enable Fingerprint login?',
                                                message: 'Do you want to be able to login with Fingerprint auth?',
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
                                                            me.androidFA.encrypt({
                                                                clientId: 'passy-app',
                                                                password: me.password
                                                            }).then(result => {

                                                                if (result.withFingerprint) {
                                                                    me.storage.set("touch_info", {username: me.username, token: result.token});
                                                                    me.dismiss();
                                                                }
                                                            })
                                                        }
                                                    }]
                                            });
                                            confirm.present();
                                        }
                                    })

                                });
                            } else {
                                me.dismiss();

                            }

                        });

                    } else {
                        me.dismiss();
                    }
                })
            }

        }, loader, this.alertCtrl);
    }

    ionViewDidLoad() {

        if (!isCordovaAvailable()) return;

        const it = this;
        this.storage.keys().then(keys => {
            if (keys.indexOf("touch_info") != -1) {

                it.storage.get("touch_info").then(data => {
                    it.touchId.isAvailable().then(_ => {
                            it.touchId.verifyFingerprint('Login to Passy with Touch ID')
                                .then(
                                    res => {

                                        let loader = it.loadingCtrl.create({
                                            content: "Logging in...",
                                            duration: 60000
                                        });
                                        loader.present();
                                        stPassy(new Passy(this.target));
                                        passy.tryLogin(data.username, data.password, it.http, function (succeeded) {
                                            if (succeeded) {
                                                loader.dismissAll();
                                                it.dismiss()
                                            }
                                        }, loader, this.alertCtrl);
                                    })

                        }, err => {

                        it.androidFA.isAvailable().then(result => {

                            if(result.isAvailable) {

                                it.androidFA.decrypt({clientId: 'passy-app', token: data.token}).then(authData => {

                                    let loader = it.loadingCtrl.create({
                                        content: "Logging in...",
                                        duration: 60000
                                    });
                                    loader.present();
                                    stPassy(new Passy(this.target));
                                    passy.tryLogin(data.username, authData.password, it.http, function (succeeded) {
                                        if (succeeded) {
                                            loader.dismissAll();
                                            it.dismiss()
                                        }
                                    }, loader, this.alertCtrl);
                                })

                            }
                        })
                        }
                    );
                });
            }
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
