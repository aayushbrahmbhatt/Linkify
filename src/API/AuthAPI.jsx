//firebase product
import { auth } from "../FirebaseConfig";
import {
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updatePassword,
    deleteUser,
} from "firebase/auth";
import { postUserData, deleteFirestoreData } from "./FirestoreAPI";
import { toast } from "react-toastify";
// let authentication = getAuth();

//API for login
export const LoginAPI = (email, password) => {
    try {
        let response = signInWithEmailAndPassword(auth, email, password);
        return response;
    } catch (error) {
        return error;
    }
};

export const RegisterAPI = (email, password) => {
    try {
        let response = createUserWithEmailAndPassword(auth, email, password);
        return response;
    } catch (error) {
        return error;
    }
};

export const GoogleAPI = (email, password) => {
    try {
        const provider = new GoogleAuthProvider();
        // let response = signInWithPopup(auth, googleAccount);

        //to prevent error
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                const email = user.email;
                const name = user.displayName;
                const photoUrl = user.photoURL;

                const userData = {
                    email: email,
                    name: name,
                    imageLink: photoUrl,
                    college: "Add Institute Name",
                    headline: "Add Headline",
                    city: "Add City",
                    country: "Add Country",
                };

                postUserData(userData);
                localStorage.setItem("userEmail", email);
                toast.info("SignIn with Google Account");
            })
            .catch((error) => {
                console.error("Error signing in with Google:", error);
            });
    } catch (error) {
        console.error("Error signing in with Google:", error);
    }
};

export const UpdatePassword = async (newPassword) => {
    try {
        await updatePassword(auth.currentUser, newPassword);
        console.log("Password updated successfully");
    } catch (error) {
        console.error("Error updating password:", error);
        throw error;
    }
};

export const deleteAccount = async (userId) => {
    try {
        await deleteUser(auth.currentUser);
        await deleteFirestoreData(userId);
        localStorage.clear();
        toast.warning("Your account has been deleted successfully");
    } catch (error) {
        console.error("Error deleting account:", error);
    }
};

export const onLogout = () => {
    try {
        signOut(auth);
        localStorage.clear();
        toast.info("You have logged out");
    } catch (error) {
        return error;
    }
};
