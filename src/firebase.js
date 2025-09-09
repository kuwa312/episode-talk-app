import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";
// import { GoogleAuthProvider } from "firebase/auth/web-extension";

const firebaseConfig = {
  apiKey: "AIzaSyDW2s3evdpcDdYVC5Kuol1mV8BMr-owTbo",
  authDomain: "episode-talk-management.firebaseapp.com",
  projectId: "episode-talk-management",
  storageBucket: "episode-talk-management.firebasestorage.app",
  messagingSenderId: "442062132204",
  appId: "1:442062132204:web:7402c1888b40a17f04a6c9",
  measurementId: "G-RR3L5TE1ME",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
