// import React from 'react'
import React from "react";
import "../Scss/HomeComponent.scss";
import PostStatus from "./common/Post";

export default function HomeComponent({ currentUser }) {
    return (
        <div>
            <PostStatus currentUser={currentUser} />
        </div>
    );
}
