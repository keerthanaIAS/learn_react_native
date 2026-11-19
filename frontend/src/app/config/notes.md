Importing reactotron-react-native directly into your web application.

* The problem is that your config/reactotron file imports:
- That native debugging package should not be loaded into the web bundle.
- while keeping Reactotron working on Android.

Now Expo automatically resolves:
--------------------------------
Android/iOS → reactotron.native.ts
Web → reactotron.ts
