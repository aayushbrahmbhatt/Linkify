import React, { useMemo } from "react";
import Navbar from "../components/common/Navbar";
import { getCurrentUser } from "../API/FirestoreAPI";
import SearchResults from "../WebPages/SearchResults";

export default function SearchResultsLayout() {
    const [currentUser, setCurrentUser] = React.useState({});
    useMemo(() => {
        getCurrentUser(setCurrentUser);
    }, []);
    return (
        <div>
            <Navbar currentUser={currentUser} />
            <SearchResults currentUser={currentUser} />
        </div>
    );
}
