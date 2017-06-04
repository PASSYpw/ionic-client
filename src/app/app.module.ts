import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HttpModule} from "@angular/http";
import {LoginPage} from "../pages/login/LoginPage";
import {PassShow} from "../pages/pass-show/pass-show";
import {NewPassPage} from "../pages/new-password/new-pass";
import {EditPassPage} from "../pages/edit-password/edit-pass";

@NgModule({
    declarations: [
        MyApp,
        //HERE
        HomePage,
        TabsPage,
        LoginPage,
        PassShow,
        NewPassPage,
        EditPassPage,

    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        HttpModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        //HERE
        HomePage,
        TabsPage,
        LoginPage,
        PassShow,
        NewPassPage,
        EditPassPage,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
