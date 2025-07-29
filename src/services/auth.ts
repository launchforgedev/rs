
'use client';

import { 
    signInWithEmailAndPassword, 
    signOut,
    User,
    createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export const handleLogin = async (email: string, password: string):Promise<User | null> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        console.error("Error signing in with email and password", error);
        throw error;
    }
};

export const handleLogout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out", error);
    }
};


export const handleSignup = async (email: string, password: string): Promise<User | null> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        console.error("Error signing up", error);
        throw error;
    }
}
