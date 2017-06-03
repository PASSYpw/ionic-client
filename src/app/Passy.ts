import {Http, Headers, RequestOptions} from "@angular/http";
import {MyApp} from "./app.component";
export var passwords = [];
export var loggedIn = false;
export class Passy {

   accessToken;
  public loggedIn = false;
  private _baseURL = "https://dev.liz3.net/passy-api/index.php";

  constructor(private app:MyApp) {


  }

  private request(http: Http, vals, callback) {

    let opt: RequestOptions
    let myHeaders: Headers = new Headers
    myHeaders.set('Content-type', 'application/x-www-form-urlencoded');
    opt = new RequestOptions({
      headers: myHeaders
    });

    http.post(this._baseURL, this.buildRequestString(vals), opt).subscribe(response => {
      callback(response);
    })


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

  public tryLogin(name: string, pass: string, http: Http, callBack){

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

        }

      });

    }

    callBack(false);
  }

  public getPassword(id, http:Http, callback) {
    if(!loggedIn) return "Error";

    this.request(http, [
      {name: "a", value: "password/query"},{name: "id", value: id},
      { name: "access_token",
      value: this.accessToken
  }
    ], function (response) {

      const json = JSON.parse(response.text());
      callback(json.data.password);

    });
  }
  private fetchPasswords(http: Http) {

    this.request(http, [{name: "a", value: "password/queryAll"}, {
      name: "access_token",
      value: this.accessToken
    }], function (response) {

      const json = JSON.parse(response.text());

      passwords = json.data;

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
