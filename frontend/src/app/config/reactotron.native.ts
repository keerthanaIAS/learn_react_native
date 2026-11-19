import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  console.log('🔥 REACTOTRON NATIVE CONFIG LOADED');

  Reactotron
    .configure({
      name: 'learn_react_native',
      host: '192.168.31.190', // Your Mac's IP
      port: 9090,
    })
    .connect();

  Reactotron.log('Hello from Android React Native!');
}

export default Reactotron;

//  Reactotron is only connected to your Android phone right now

// Why it doesn't work on Web:
// ----------------------------
// Reactotron has two different client packages. 
// You installed reactotron-react-native, which contains native modules and plugins specific to mobile devices. 
// When you try to bundle your app for the web, this package fails because the browser doesn't understand React Native's internal code .

// There is a known issue where using reactotron-react-native in an 
// Expo web build causes a bundling error (Unable to resolve "../Utilities/Platform"), 
// which forces developers to comment out the Reactotron import just to get the web version to run .

// How to make it work on Web (if you really need to):
// ---------------------------------------------------
// To see logs in the browser, you would need to install the web-specific package and change your configuration file:
// Run npm install --save-dev reactotron-react-js.
// In your config file, use import Reactotron from 'reactotron-react-js' instead of reactotron-react-native.