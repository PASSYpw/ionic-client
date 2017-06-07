# ionic-client
This app, written with the Ionic Framework is a cross platform mobile app, which makes PASSY on phones more user friendly.

## Running via CLI
First install the dependencies needed to run the app:

```bash
$ sudo npm install -g ionic cordova
```
Now you need to change to the directory, where this project is located and then execute the following
```bash
$ npm install
```

Then test it on your platform.

### iOS
To test on iOS you will need a macOS installation.
```bash
$ ionic cordova platform add ios
$ ionic cordova run ios
```

### Android
To test on Android you will have to have ADB installed on your machine and ADB enabled on your Android device.
```bash
$ ionic cordova platform add android
$ ionic cordova run android
```
