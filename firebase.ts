import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from '@firebase/firestore'
import { getAuth } from '@firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyDgefw7tLVVmjMbH3rQdLJn6kxiff2xqXU',
    authDomain: 'modillo.firebaseapp.com',
    projectId: 'modillo',
    storageBucket: 'modillo.appspot.com',
    messagingSenderId: '251263356165',
    appId: '1:251263356165:web:43def0caad31f21bee7b6c',
    measurementId: 'G-SFYH7M9LXS'
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)
const auth = getAuth(app)

export default app
export { auth, db }