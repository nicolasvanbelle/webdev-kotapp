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
export default fire;