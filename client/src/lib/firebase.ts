import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || ""}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || ""}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth functions
export const loginOrRegister = async (email: string, password: string): Promise<User> => {
  try {
    // Try to sign in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    // If sign in fails, create a new account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }
};

export const logout = () => signOut(auth);

// Firestore functions
export const createUserProfile = async (userId: string, data: any) => {
  await setDoc(doc(db, "usuarios", userId), {
    ...data,
    createdAt: new Date().toISOString()
  });
};

export const getUserProfile = async (userId: string) => {
  const docRef = doc(db, "usuarios", userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

export const createCard = async (userId: string, cardData: any) => {
  const cardRef = doc(db, "cartoes", userId);
  await setDoc(cardRef, {
    ...cardData,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return userId;
};

export const getCard = async (cardId: string) => {
  const docRef = doc(db, "cartoes", cardId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

export const updateCard = async (cardId: string, data: any) => {
  const cardRef = doc(db, "cartoes", cardId);
  await updateDoc(cardRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
};

export const deleteCard = async (cardId: string) => {
  await deleteDoc(doc(db, "cartoes", cardId));
};

export const getAllCards = async () => {
  const cardsRef = collection(db, "cartoes");
  const querySnapshot = await getDocs(cardsRef);
  
  const cards: any[] = [];
  querySnapshot.forEach((doc) => {
    cards.push({ id: doc.id, ...doc.data() });
  });
  
  return cards;
};

// Storage functions
export const uploadImage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};
