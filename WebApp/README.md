# Dog Walk Nation
This folder is the storage for the application code, written in React Native.

Due to the fact that this is a mobile application there are certain emulators that can be used, like Android Studio. However, most emulators don't work with live maps or geolocation libraries, which is rather large chunk of this application.

--- 
## Building the .apk
If you would like to build your own .apk file then you can clone or download the repository, open a command window or terminal and navigate to the folder:  `..\FinalProject\WebApp`

From here run the command `npm install` (PLEASE NOTE: You will need to have [node.js installed](https://nodejs.org/en/download/) for this work)

Next, navigate to this folder: `..\FinalProject\WebApp\android` (You can do `cd android` from the current folder)

From here, if you are using a Windows Command Prompt you can run `gradlew assembleRelease`, or if you are on a Windows powershell terminal, Linux or Mac run `./gradlew assembleRelease`

PLEASE NOTE: To run the previous command you need to have an Android SDK downloaded (one is included with [Android Studio](https://developer.android.com/studio)), and a Java JDK downloaded ([version 15.0.2](https://www.oracle.com/java/technologies/javase/jdk15-archive-downloads.html) is known to work with this project). With these downloaded the environment variables of ANDROID_HOME and JAVA_HOME must be configured, pointing at the install directories for Android and Java. Also, if you do not have Gradle installed, it will download itself when running the command.

Once that executes successfully (this can take a few minutes), you should find the .apk file called "app-release.apk" in `WebApp\android\app\build\outputs\apk\release`

---
## Download the .apk

If you'd like to skip all of that and download the android installation file (dogwalknation.apk), you can follow this link: [Google drive .apk download.](https://drive.google.com/file/d/1_7RQD57YDIgTfcys1f0lZFpkUGD1JTjU/view?usp=sharing)

Alternatively, you can scan the QR code with your Android device to download the installation file directly:

![QR Code for .apk download](https://github.com/Frankles143/FinalProject/blob/master/Resources/ReadMe%20Images/QR%20link%20to%20APK.png)

---

## Usage

Once the file has been downloaded you can install it on your device - though you might need to allow installation for outside sources first. 

From here you can create an account, or you log in with the test account with the details below: 

- Email: guest@dogwalknation.co.uk
- Password: dogs123

You can also see the app in use in the following YouTube video: [DogWalkNation background and tutorial](https://youtu.be/AsMSlC0MD_w)