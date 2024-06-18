import React, { useEffect, useState } from "react";
import "../Scss/MessengersComponent.scss";
import { getAllUsers, getCurrentUser } from "../API/FirestoreAPI";
import MessagingUser from "./common/MessagingUser";

export default function MessengersComponent({ currentUser }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getAllUsers(setUsers);
    }, []);

    return (
        <div className="">
            {users.map((user) => {
                return (
                    user.id !== currentUser?.userid && (
                        <MessagingUser
                            user={user}
                            key={user.id}
                            getCurrentUser={getCurrentUser}
                            currentUser={currentUser}
                        />
                    )
                );
            })}
        </div>
    );
}
