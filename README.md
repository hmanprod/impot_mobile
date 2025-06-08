# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## KEY ANDROID
keystor pw : 123456CDI
keystor alias : hmanprod

## BUILD ANDROID

<!-- Clean -->
cd android
./gradlew clean
cd ..

<!-- Create Bundle -->
npx react-native bundle --platform android --dev false --entry-file node_modules/expo-router/entry.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

<!-- Remove unused resources -->
cd android
rm -rf app/src/main/res/drawable-*
rm -rf app/src/main/res/raw

<!-- Build -->
./gradlew assembleRelease

## DEPLOY LOCALLY
cd ..
adb devices
adb install -r android/app/build/outputs/apk/release/app-release.apk
