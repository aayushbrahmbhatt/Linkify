import React from "react";
import "./index.scss";
import usericon from "../../../assets/dummy-image.png";
import { useNavigate } from "react-router-dom";

export default function UserMessages({ user }) {
    let navigate = useNavigate();

    const handleClick = () => {
        navigate("/profile", {
            state: { id: user.id, email: user.email },
        });
    };

    return (
        <div className="searched-user" onClick={handleClick}>
            <img
                src={user.imageLink || usericon}
                alt={user.name}
                style={{ color: "black" }}
            />
            <div className="user-details">
                <p className="name">{user.name}</p>
                <p className="headline">{user.headline}</p>
            </div>
        </div>
    );
}
