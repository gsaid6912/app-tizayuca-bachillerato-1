import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAXS8kdEaG4IbjMZdQgffdV2S3RMAo8KzE",
  authDomain: "noticiasesti.firebaseapp.com",
  projectId: "noticiasesti",
  storageBucket: "noticiasesti.firebasestorage.app",
  messagingSenderId: "436501289104",
  appId: "1:436501289104:web:f20b0047e307537586e015",
  measurementId: "G-73B2M74W51"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
