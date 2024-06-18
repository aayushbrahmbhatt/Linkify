import React, { useEffect, useState } from "react";
import MessengersComponent from "../components/MessengersComponent.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../FirebaseConfig.js";
import Loader from "../components/common/Loader/index.jsx";

export default function Messengers({ currentUser }) {
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
        <MessengersComponent currentUser={currentUser} />
    );
}
