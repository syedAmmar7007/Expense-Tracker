import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseSetup/firebaseConfig";
import { getDoc, setDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const expenseContext = createContext("");

export const ExpenseProvider = ({ children }) => {
  const [profile, setProfile] = useState("");
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  const signUp = async ({ email, password, monthlyBudget, name }) => {
    const normalizedEmail = email.toLowerCase();

    const res = await createUserWithEmailAndPassword(
      auth,
      normalizedEmail,
      password,
    );
    const user = res.user;
    const profileData = {
      uid: user.uid,
      name,
      email: normalizedEmail,
      monthlyBudget: Number(monthlyBudget) || 0,
      createdAt: Date.now(),
    };
    await setDoc(doc(db, "users", user.uid), profileData);
    setProfile(profileData);
    setUser(user);

    return user;
  };

  const login = (email, password) => 
    signInWithEmailAndPassword(auth,email,password);

  const logout = () => 
    signOut(auth);


  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (snap.exists()) setProfile(snap.data());
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <expenseContext.Provider value={{ signUp, login, logout }}>
      {children}
    </expenseContext.Provider>
  );
};
export const useAuth = () => useContext(expenseContext);
