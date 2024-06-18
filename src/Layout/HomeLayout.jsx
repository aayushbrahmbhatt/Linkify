import React, { useEffect, useState, useMemo } from "react";
import Home from "../WebPages/Home";
import Navbar from "../components/common/Navbar";
import { getCurrentUser } from "../API/FirestoreAPI";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { auth } from "../FirebaseConfig";
import Loader from "../components/common/Loader/index.jsx";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

export default function HomeLayout() {
    let navigate = useNavigate();
    let location = useLocation();
    const [currentUser, setCurrentUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    useMemo(() => {
        getCurrentUser(setCurrentUser);
    }, []);

    const refreshVerificationStatus = () => {
        setLoading(true);
        setIsEmailVerified(false);
        const user = auth.currentUser;
        if (user) {
            user.reload().then(() => {
                setIsEmailVerified(user.emailVerified);
                setLoading(false);
            });
        }
    };

    const resendVerificationEmail = () => {
        const user = auth.currentUser;
        if (user) {
            sendEmailVerification(user)
                .then(() => {
                    toast.info("Verification email sent!");
                })
                .catch((error) => {
                    toast.error("Error sending verification email:", error);
                });
        }
    };

    const handleLogout = () => {
        auth.signOut().then(() => {
            navigate("/login");
        });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsEmailVerified(user.emailVerified);
                setLoading(false);
            } else {
                setIsEmailVerified(false);
                setLoading(false);
                if (
                    location.pathname !== "/login" &&
                    location.pathname !== "/signup"
                ) {
                    navigate("/login");
                }
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div>
            {loading ? (
                <Loader />
            ) : isEmailVerified ? (
                <>
                    <Navbar currentUser={currentUser} />
                    <Home currentUser={currentUser} />
                </>
            ) : (
                <div>
                    <p style={{ color: "red" }}>
                        Please verify your email to access the home page.{" "}
                        <span
                            onClick={refreshVerificationStatus}
                            style={{
                                cursor: "pointer",
                                color: "blue",
                                textDecoration: "underline",
                            }}
                        >
                            Click here to refresh
                        </span>{" "}
                        |{" "}
                        <button onClick={resendVerificationEmail}>
                            Resend Verification Email
                        </button>{" "}
                        |{" "}
                        <button onClick={handleLogout} title="Logout">
                            Logout
                        </button>
                    </p>
                </div>
            )}
        </div>
    );
}
