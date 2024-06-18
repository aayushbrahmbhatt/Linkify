import React, { useMemo } from "react";
import Navbar from "../components/common/Navbar";
import { getCurrentUser } from "../API/FirestoreAPI";
import ResumeBuilder from "../WebPages/ResumeBuilder";

export default function ResumeBuilderLayout() {
    const [currentUser, setCurrentUser] = React.useState({});
    useMemo(() => {
        getCurrentUser(setCurrentUser);
    }, []);
    return (
        <div>
            <Navbar currentUser={currentUser} />
            <ResumeBuilder currentUser={currentUser} />
        </div>
    );
}
