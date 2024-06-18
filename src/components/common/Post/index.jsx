import React, { useState, useMemo, useEffect } from "react";
import "./index.scss";
import ModalComponent from "../Modal";
import PostsCard from "../PostsCard";
import { getCurrentTimeStamp } from "../../../helpers/useMoment";
import {
    postStatus,
    getStatus,
    updatePost,
    getAllFollowers,
    getAllFollowing,
    removeConnection,
} from "../../../API/FirestoreAPI";
import { getUniqueID } from "../../../helpers/getUniqueID";
import { uploadPostImage } from "../../../API/ImageUpload";
import usericon from "../../../assets/user-icon.png";
import { useNavigate } from "react-router-dom";

export default function PostStatus({ currentUser }) {
    let userEmail = localStorage.getItem("userEmail");
    const [modalOpen, setModalOpen] = useState(false);
    const [status, setStatus] = useState("");
    const [allStatuses, setAllStatus] = useState([]);
    const [currentPost, setCurrentPost] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [postImage, setPostImage] = useState("");
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    let navigate = useNavigate();
    // console.log(currentUser);

    const sendStatus = async () => {
        let object = {
            status: status,
            timeStamp: getCurrentTimeStamp("LLL"),
            userEmail: currentUser.email,
            userName: currentUser.name,
            userID: currentUser.userid,
            postID: getUniqueID(),
            postImage: postImage,
        };
        await postStatus(object);
        setModalOpen(false);
        setIsEdit(false);
        setStatus("");
        setPostImage("");
    };

    const getEditData = (posts) => {
        setModalOpen(true);
        setStatus(posts?.status);
        setCurrentPost(posts);
        setIsEdit(true);
    };

    const updateStatus = () => {
        // console.log(status);
        updatePost(currentPost.id, status, postImage);
        setModalOpen(false);
    };

    useMemo(() => {
        getStatus(setAllStatus);
    }, []);

    const openUser = (user) => {
        navigate("/profile", {
            state: {
                id: user?.id,
                email: user?.email,
            },
        });
        window.location.reload();
    };

    useEffect(() => {
        getAllFollowers(currentUser.userid, setFollowers);
    }, [currentUser.userid]);

    useEffect(() => {
        getAllFollowing(currentUser.userid, setFollowing);
    }, [currentUser.userid]);

    const handleClick = (event, user) => {
        event.preventDefault();

        if (event.target.classList.contains("unfollow-btn")) {
            removeConnection(currentUser?.userid, user.id);
            // const updatedFollowers = followers.filter(user => user.id !== id);
            // setFollowers(updatedFollowers);
        } else if (event.target.classList.contains("remove-btn")) {
            removeConnection(user.id, currentUser?.userid);
        } else {
            openUser(user);
        }
    };

    return (
        <div className="main">
            {/* <div className="left-info">
                <div className="post-status">
                    <div className="profile-image">
                        <img
                            className="post-image"
                            src={currentUser?.imageLink || usericon}
                            alt="imageLink"
                        />
                    </div>
                    <div className="user-name">
                        <p>{currentUser?.name}</p>
                    </div>
                </div>
            </div> */}

            <div
                className="left-info"
                onClick={() =>
                    navigate("/profile", {
                        state: {
                            id: currentUser?.userid,
                            email: currentUser?.email,
                        },
                    })
                }
            >
                <div className="post-status">
                    <div className="profile-image">
                        <img
                            className="post-image"
                            src={currentUser?.imageLink || usericon}
                            alt="imageLink"
                        />
                    </div>
                    <div className="user-info">
                        <p className="name">{currentUser?.name}</p>
                        <p className="headline">{currentUser?.headline}</p>
                    </div>
                </div>
            </div>
            <div className="post-status-parent">
                <div className="post-status">
                    {/* <div className="profile-image">
                        <img
                            className="post-image"
                            src={currentUser?.imageLink || usericon}
                            alt="imageLink"
                        />
                    </div> */}
                    <button
                        className="create-post"
                        onClick={() => {
                            setModalOpen(true);
                            setIsEdit(false);
                        }}
                    >
                        {" "}
                        Create a Post
                    </button>
                </div>
                <ModalComponent
                    setStatus={setStatus}
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    status={status}
                    sendStatus={sendStatus}
                    isEdit={isEdit}
                    updateStatus={updateStatus}
                    postImage={postImage}
                    setPostImage={setPostImage}
                    uploadPostImage={uploadPostImage}
                    currentPost={currentPost}
                    setCurrentPost={setCurrentPost}
                />

                <div>
                    {allStatuses.map((posts) => {
                        return (
                            <div key={posts.id}>
                                <PostsCard
                                    posts={posts}
                                    getEditData={getEditData}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="right-info">
                {/* <div className="post-status"> */}
                {/* <div className="profile-image">
                        <img
                            className="post-image"
                            src={currentUser?.imageLink || usericon}
                            alt="imageLink"
                        />
                    </div> */}
                <p>List of Followers</p>
                <div className="followers-results">
                    {followers.length === 0 ? (
                        <div className="followers-inner">No results</div>
                    ) : (
                        followers.map((user) => (
                            <div
                                className="followers-inner"
                                onClick={(event) => {
                                    // console.log(user);
                                    handleClick(event, user);
                                }}
                            >
                                <img
                                    src={user?.imageLink || usericon}
                                    alt={user.name}
                                />
                                <p className="name">{user?.name}</p>
                                <button className="remove-btn"> Remove</button>
                            </div>
                        ))
                    )}
                </div>

                <p>List of Following</p>
                <div className="following-results">
                    {following.length === 0 ? (
                        <div className="following-inner">No results</div>
                    ) : (
                        following.map((user) => (
                            <div
                                className="following-inner"
                                onClick={(event) => {
                                    // console.log(user);
                                    handleClick(event, user);
                                }}
                            >
                                <img
                                    src={user?.imageLink || usericon}
                                    alt={user.name}
                                />
                                <p className="name">{user?.name}</p>
                                <button className="unfollow-btn">
                                    {" "}
                                    Unfollow
                                </button>
                            </div>
                        ))
                    )}
                </div>
                {/* </div> */}
            </div>
        </div>
    );
}
