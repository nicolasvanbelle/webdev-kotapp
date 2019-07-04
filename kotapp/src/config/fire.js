import firebase from 'firebase';
const config = {
    apiKey: "AIzaSyCHQRYxKIqtDYkZVT7FXC-Zwwe7Qt8wG_E",
    authDomain: "kotapp-21bb7.firebaseapp.com",
    databaseURL: "https://kotapp-21bb7.firebaseio.com",
    projectId: "kotapp-21bb7",
    storageBucket: "kotapp-21bb7.appspot.com",
    messagingSenderId: "640854623368"
};
const fire = firebase.initializeApp(config);
fire.firestore().enablePersistence().catch(function (err) {
    if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        // ...
    } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
    }
});
export default fire;