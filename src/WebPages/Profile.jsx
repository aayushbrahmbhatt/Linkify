import React, { useEffect, useState } from "react";
import ProfileComponent from "../components/ProfileComponent";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../FirebaseConfig";
import Loader from "../components/common/Loader/index.jsx";

export default function Profile({ currentUser }) {
    const [loading, setLoading] = useState(true);
    let navigate = useNavigate();
    useEffect(() => {
        onAuthStateChanged(auth, (res) => {
            if (!res?.accessToken) {
                navigate("/");
            } else {
                setLoading(false);
            }
        });
    }, []);
    return loading ? (
        <Loader />
    ) : (
        <ProfileComponent currentUser={currentUser} />
    );
}
