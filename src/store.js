import { createStore, combineReducers, compose } from 'redux';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';


/////configurar fireStore


const firebaseConfig = {
    apiKey: "AIzaSyAQnFvXGkPrJq-K4dyidk9qiC5m4tGdlN0",
    authDomain: "bibliostore-3d40e.firebaseapp.com",
    databaseURL: "https://bibliostore-3d40e.firebaseio.com",
    projectId: "bibliostore-3d40e",
    storageBucket: "bibliostore-3d40e.appspot.com",
    messagingSenderId: "998084585591",
    appId: "1:998084585591:web:a86c3f2329e2d28eaf3e72"
  
}; 


////INIIALIZAR FIREBASE

firebase.initializeApp(firebaseConfig);


//////CONFIGURACION DE REACT-REDUX

const rrfConfig={

    userProfile:'users',
    useFirestoreForProfile: true

}

/////  creando un enlace de compose de redux farestore


const createStoreWithFirebase = compose(

    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase)

)(createStore);



///////////////////REDUCER

const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer
});


///// StateInicial


const initialState={

}


//// cear el Store

const store = createStoreWithFirebase(rootReducer, initialState, compose(

    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

export default store;
