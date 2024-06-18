import React, { useMemo, useState } from "react";
import { getCurrentUser } from "../API/FirestoreAPI";
import Navbar from "../components/common/Navbar";
import Profile from "../WebPages/Profile";

export default function ProfileLayout() {
    const [currentUser, setCurrentUser] = useState({});
    useMemo(() => {
        getCurrentUser(setCurrentUser);
    }, []);
    return (
        <div>
            <Navbar currentUser={currentUser} />
            <Profile currentUser={currentUser} />
        </div>
    );
}
