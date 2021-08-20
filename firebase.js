import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAF8G-PkCy4u7y-ZbrO5k22gzni-X4U4lM",
    authDomain: "socially-dd898.firebaseapp.com",
    projectId: "socially-dd898",
    storageBucket: "socially-dd898.appspot.com",
    messagingSenderId: "195286176803",
    appId: "1:195286176803:web:28d7d216d2cf5c7e5bcd96",
    measurementId: "G-BSP507SDEB"
  };

  let app;

  if (firebase.apps.length === 0) {
    //   firebase.firestore().settings({ experimentalForceLongPolling: true });
      const firebaseApp = firebase.initializeApp(firebaseConfig);
  } else {
      app = firebase.app();
  }
  
  const db = firebase.firestore();
  
  const auth = firebase.auth();

  const storage = firebase.storage();
  
  export {db, auth, storage };
  