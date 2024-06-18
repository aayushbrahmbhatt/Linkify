import React, { useEffect, useState } from "react";
import ConnectionsComponent from "../components/ConnectionsComponent.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../FirebaseConfig";
import Loader from "../components/common/Loader/index.jsx";

export default function Connections({ currentUser }) {
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
        <ConnectionsComponent currentUser={currentUser} />
    );
}
