import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqOUFEI5gHmEp0z7opI7GaTNvx757CK6Q",
  authDomain: "matt-test-prod.firebaseapp.com",
  databaseURL: "https://matt-test-prod-default-rtdb.firebaseio.com",
  projectId: "matt-test-prod",
  storageBucket: "matt-test-prod.appspot.com",
  messagingSenderId: "745332688443",
  appId: "1:745332688443:web:c7cc9a22dd23a0537d3e1e",
  measurementId: "G-KN02P89HCB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


const storage = firebase.storage()

export{
    storage, firebase as default
}