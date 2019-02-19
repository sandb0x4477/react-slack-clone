import firebase from 'firebase/app';
// import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import 'firebase/database';
// import 'dotenv/config';
// import firebase from 'firebase';
// import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBExsHh8PamnMItyOvdUojOnJCqpEiWWkw',
  authDomain: 'react-slack-clone-d968b.firebaseapp.com',
  databaseURL: 'https://react-slack-clone-d968b.firebaseio.com',
  projectId: 'react-slack-clone-d968b',
  storageBucket: 'react-slack-clone-d968b.appspot.com',
  messagingSenderId: '920103857947'
};

firebase.initializeApp(firebaseConfig);
// const firestore = firebase.firestore();
// const settings = {};
// firestore.settings(settings);

export default firebase;
