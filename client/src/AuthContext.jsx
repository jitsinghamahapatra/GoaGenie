import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  getAdditionalUserInfo
} from 'firebase/auth';
import { ref, runTransaction } from 'firebase/database';
import { auth, db } from './firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup = async (email, password, displayName) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(res.user, { displayName });
    }
    
    // Increment total user count
    const countRef = ref(db, 'stats/userCount');
    await runTransaction(countRef, (current) => (current || 0) + 1);
    
    return res;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    
    const details = getAdditionalUserInfo(res);
    if (details && details.isNewUser) {
      const countRef = ref(db, 'stats/userCount');
      await runTransaction(countRef, (current) => (current || 0) + 1);
    }
    
    return res;
  };

  const value = {
    user,
    signup,
    login,
    logout,
    googleSignIn
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
