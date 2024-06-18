import React, { useEffect, useState } from "react";
import "../Scss/ConnectionsComponent.scss";
import {
    getAllUsers,
    addConnection,
    getConnections,
    removeConnection,
} from "../API/FirestoreAPI";
import ConnectedUsers from "./common/ConnectedUsers";

export default function ConnectionsComponent({ currentUser }) {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    const getCurrentUser = (id) => {
        addConnection(currentUser?.userid, id);
    };

    const removeCurrentUser = (id) => {
        removeConnection(currentUser?.userid, id);
    };

    useEffect(() => {
        getAllUsers(setUsers);
    }, []);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const Pagination = ({
        usersPerPage,
        totalUsers,
        paginate,
        currentPage,
    }) => {
        const pageNumbers = [];

        for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
            pageNumbers.push(i);
        }

        return (
            <nav>
                <ul className="pagination">
                    {pageNumbers.map((number) => (
                        <li key={number} className="page-item">
                            <button
                                onClick={() => paginate(number)}
                                className={`page-link ${
                                    currentPage === number ? "active" : ""
                                }`}
                            >
                                {number}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        );
    };

    return (
        <>
            <div className="connections-container">
                {currentUsers.map(
                    (user) =>
                        user.id !== currentUser?.userid && (
                            <ConnectedUsers
                                user={user}
                                key={user.id}
                                getCurrentUser={getCurrentUser}
                                currentUser={currentUser}
                                removeCurrentUser={removeCurrentUser}
                            />
                        )
                )}
            </div>
            <Pagination
                usersPerPage={usersPerPage}
                totalUsers={users.length}
                paginate={paginate}
                currentPage={currentPage}
            />
        </>
    );
}
