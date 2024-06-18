import React, { useMemo } from "react";
import Navbar from "../components/common/Navbar";
import { getCurrentUser } from "../API/FirestoreAPI";
import Connections from "../WebPages/Connections";

export default function ConnectionLayout() {
    const [currentUser, setCurrentUser] = React.useState({});
    useMemo(() => {
        getCurrentUser(setCurrentUser);
    }, []);
    return (
        <div>
            <Navbar currentUser={currentUser} />
            <Connections currentUser={currentUser} />
        </div>
    );
}
