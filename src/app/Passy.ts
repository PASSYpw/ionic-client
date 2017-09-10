import {Http, Headers, RequestOptions} from "@angular/http";
import {loginScreen, popAlert} from "../pages/tabs/tabs";
import {AlertController} from "ionic-angular";

export var passwords = [];
export var archived = [];
export var loggedIn = false;
export function randomPassword(length) {
    var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#-.,+*$%&!",
        string = "";
    for (var i = 0; i < length; i++) {
        var position = Math.floor(Math.random() * alphabet.length);
        string += alphabet.charAt(position);
    }
    return string;
}
export class Passy {

    accessToken;
    public loggedIn = false;
    private _baseURL = "https://passy-api.herokuapp.com";
    private _target = "https://app.passy.pw/action.php";
    public isFingerPrint = false;
    public timer;

    constructor(target: string) {


        let toMod = target;

        if (target != null) {
            if (toMod.indexOf("action.php") != -1) {
                this._target = toMod;
            } else {
                if (toMod.endsWith("/")) {
                    this._target = toMod + "action.php";
                } else {
                    this._target = toMod + "/action.php";
                }
            }
        }



    }

    public logOut() {

            passwords = [];
            archived = [];
            this.accessToken = "";
            loginScreen();
            clearInterval(this.timer);

    }
    private request(http: Http, vals, callback) {

        let opt: RequestOptions;
        let myHeaders: Headers = new Headers;
        myHeaders.set('Content-type', 'application/x-www-form-urlencoded');
        opt = new RequestOptions({
            headers: myHeaders
        });
        vals.push({name: "target", value: this._target});
        http.post(this._baseURL, this.buildRequestString(vals), opt).subscribe(response => {
            callback(response);
        })


    }

    public archive(http, id, callback) {

        const me = this;

        this.request(http, [{name: "a", value: "password/archive"}, {name: "id", value: id}, {
            name: "access_token",
            value: this.accessToken
        }], function (response) {

            const json = JSON.parse(response.text());

            if (json.success) {
                me.fetchPasswords(http);
            }
            callback(json);
        });

    }

    private buildRequestString(data: any[]) {

        let response = "";
        for (let i = 0; i != data.length; i++) {
            const current = data[i];
            if (response != "") response += "&";
            response += encodeURIComponent(current.name) + "=" + encodeURIComponent(current.value);
        }
        return response;
    }

    public addPassword(http: Http, username, password, description, callback) {

        const data = [{name: "a", value: "password/create"},
            {name: "access_token", value: this.accessToken},
            {name: "username", value: username}, {name: "password", value: password}, {
                name: "description",
                value: description
            }];

        const me = this;
        this.request(http, data, function (response) {

            const json = JSON.parse(response.text());
            if (json.success) {
                me.fetchPasswords(http);
            }
            callback(json);
        });

    }

    public tryLogin(name: string, pass: string, http: Http, callBack, loader, alertController:AlertController) {

        if (this.loggedIn) return;

        if (name != "" && pass != "") {

            const me = this;
            this.request(http, [{name: "a", value: "user/login"},
                {name: "username", value: name}, {name: "password", value: pass}], function (response) {


                console.log(response)
                const data = JSON.parse(response.text());

                if (data.success) {

                    me.accessToken = data.token[0];

                    me.fetchPasswords(http);
                    loggedIn = true;
                    callBack(true);

                     me.timer = setInterval(function () {
                        me.request(http, [{name: "access_token", value: me.accessToken}, {
                            name: "a",
                            value: "status"
                        }], function (response) {

                            const json = JSON.parse(response.text());
                            if (!json.data.logged_in) {
                                passwords = [];
                                archived = [];
                                me.accessToken = "";
                                loginScreen();
                                clearInterval(me.timer);
                            }

                        })

                    }, 2000);
                } else {
                    if(data.msg == "two_factor_needed") {

                        let twoFaPrompt = alertController.create({
                            title: 'Login',
                            inputs: [
                                {
                                    name: 'code',
                                    placeholder: 'Two Factor Code'
                                }
                            ],
                            buttons: [
                                {
                                    text: 'Cancel',
                                    role: 'cancel',
                                    handler: data => {
                                        callBack(false);
                                        return;
                                    }
                                },
                                {
                                    text: 'Login',
                                    handler: data => {

                                        me.request(http, [{name: "a", value: "user/login"},
                                            {name: "username", value: name}, {name: "password", value: pass}, {name: "2faCode", value: data.code}], (response) => {

                                            const data = JSON.parse(response.text());

                                            me.accessToken = data.token[0];

                                            me.fetchPasswords(http);
                                            loggedIn = true;
                                            callBack(true);

                                            me.timer = setInterval(function () {
                                                me.request(http, [{name: "access_token", value: me.accessToken}, {
                                                    name: "a",
                                                    value: "status"
                                                }], function (response) {

                                                    const json = JSON.parse(response.text());
                                                    if (!json.data.logged_in) {
                                                        passwords = [];
                                                        archived = [];
                                                        me.accessToken = "";
                                                        loginScreen();
                                                        clearInterval(me.timer);
                                                    }

                                                })

                                            }, 2000);


                                        });

                                        return;
                                    }
                                }
                            ]
                        });
                        twoFaPrompt.present();


                        return;
                    }
                    loader.dismissAll();
                    popAlert("Failed", "Failed to login");
                }

            });

        }

        callBack(false);
    }

    public getPassword(id, http: Http, callback) {
        if (!loggedIn) return "Error";

        this.request(http, [
            {name: "a", value: "password/query"}, {name: "id", value: id},
            {
                name: "access_token",
                value: this.accessToken
            }
        ], function (response) {

            const json = JSON.parse(response.text());
            callback(json.data.password);

        });
    }

    public editPassword(id, username, password, description, http, callback) {

        const me = this;
        const data = [{name: "id", value: id},
            {name: "a", value: "password/edit"},
            {name: "username", value: username},
            {name: "password", value: password},
            {name: "description", value: description},
            {name: "access_token", value: this.accessToken}];

        this.request(http, data, function (response) {

            const json = JSON.parse(response.text());
            if (json.success) {
                me.fetchPasswords(http);
            }
            callback(json);


        });

    }

    public restorePass(http, id, callback) {

        const data = [{name: "a", value: "password/restore"}, {name: "id", value: id}, {
            name: "access_token",
            value: this.accessToken
        }];
        const me = this;

        this.request(http, data, function (response) {
            if (response.success) {
                me.fetchPasswords(http);
            }
            callback(JSON.parse(response.text()));
        });


    }

    public delPass(http, id, callback) {

        const data = [{name: "a", value: "password/delete"}, {name: "id", value: id}, {
            name: "access_token",
            value: this.accessToken
        }];
        const me = this;

        this.request(http, data, function (response) {
            if (response.success) {
                me.fetchPasswords(http);
            }
            callback(JSON.parse(response.text()));
        });


    }

    public fetchPasswords(http: Http) {

        this.request(http, [{name: "a", value: "password/queryAll"}, {
            name: "access_token",
            value: this.accessToken
        }], function (response) {

            const json = JSON.parse(response.text());

            const fetched = [];
            const archive = [];
            for (let i = 0; i != json.data.length; i++) {
                const current = json.data[i];
                current.vis = true;
                current.totalVis = true;

                if (current.archived) {
                    archive.push(current);
                    continue;
                }
                fetched.push(current);
            }
            archived = archive;
            passwords = fetched;

        });


    }

}

export class Password {

    private _id;
    private _description;
    private _username;


    constructor(id, description, username) {
        this._id = id;
        this._description = description;
        this._username = username;
    }

    get id() {
        return this._id;
    }

    get description() {
        return this._description;
    }

    get username() {
        return this._username;
    }
}

export let isCordovaAvailable = () => {
    if (!(<any>window).cordova) {
        return false;
    }
    return true;
};
