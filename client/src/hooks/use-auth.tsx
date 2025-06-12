import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { auth } from "../lib/firebase";

// Create auth context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginOrRegister: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  loginOrRegister: async () => { throw new Error("Not implemented"); },
  logout: async () => {},
  isAdmin: false
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
      
      // Check if user is admin (email ends with @admin.com)
      if (authUser && authUser.email) {
        setIsAdmin(authUser.email.endsWith('@admin.com'));
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Login or register function
  const loginOrRegister = async (email: string, password: string): Promise<User> => {
    setError(null);
    try {
      // First try to sign in
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      } catch (signInError) {
        // If sign in fails, create a new account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      }
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, loginOrRegister, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);