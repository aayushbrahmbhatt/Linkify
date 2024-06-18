import React, { useMemo, useState, useEffect } from "react";
import "./index.scss";
import {
    likePost,
    getLikesByUser,
    postComment,
    getComments,
    getUserById,
} from "../../../API/FirestoreAPI";
import { BiLike, BiSolidLike, BiSolidCommentDots } from "react-icons/bi";
import { getCurrentTimeStamp } from "../../../helpers/useMoment";

export default function LikeButton({ userId, postId, currentUser }) {
    const [likesCount, setLikesCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [showCommentBox, setshowCommentBox] = useState(false);
    const [comment, setComment] = useState("");
    const [showComments, setShowComments] = useState([]);
    const [commenterNames, setCommenterNames] = useState({});

    const getComment = (event) => {
        setComment(event.target.value);
    };

    const handleLike = () => {
        likePost(userId, postId, liked);
    };
    const orderedComments = useMemo(() => {
        return showComments
            .slice()
            .sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
    }, [showComments]);

    const uploadComment = () => {
        postComment(
            postId,
            userId,
            comment,
            getCurrentTimeStamp("LL LTS"),
            currentUser?.email
        );
        setComment("");
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter" && comment.trim() !== "") {
            uploadComment();
        }
    };

    useEffect(() => {
        const fetchCommenterNames = async () => {
            const names = {};
            orderedComments.forEach(async (comment) => {
                const name = await getCommenterName(comment.email);
                names[comment.id] = name;
            });
            setCommenterNames(names);
        };
        fetchCommenterNames();
    }, [orderedComments]);

    useMemo(() => {
        getLikesByUser(userId, postId, setLiked, setLikesCount);
        getComments(postId, setShowComments);
    }, [userId, postId]);

    const getCommenterName = async (commentUserId) => {
        try {
            const user = await getUserById(commentUserId);
            return user ? user.name : "Unknown";
        } catch (error) {
            console.error("Error fetching commenter's name:", error);
            return "Unknown";
        }
    };

    return (
        <div className="like-container">
            <p className="like-count">
                {likesCount === 0 ? "" : likesCount}{" "}
                {likesCount === 0 ? "" : likesCount === 1 ? "like" : "likes"}
            </p>

            <div className="hr-line">
                <hr />
            </div>

            <div className="like-comment-common">
                <div className="likes-comment-inner" onClick={handleLike}>
                    {liked ? (
                        <BiSolidLike className="purple" size={30} />
                    ) : (
                        <BiLike className="black" size={30} />
                    )}
                    <p className={liked ? "purple" : "black"}>Like</p>
                </div>
                <div
                    className="likes-comment-inner"
                    onClick={() => setshowCommentBox(!showCommentBox)}
                >
                    <BiSolidCommentDots
                        className={showCommentBox ? "purple" : "black"}
                        size={30}
                    />
                    <p className={showCommentBox ? "purple" : "black"}>
                        Comments
                    </p>
                </div>
            </div>
            {showCommentBox ? (
                <>
                    {orderedComments.length > 0 ? (
                        orderedComments.map((comment, index) => (
                            <div className="comment-preview" key={index}>
                                <div className="comment-header">
                                    <p className="comment-name">
                                        {commenterNames[comment.id]}
                                    </p>
                                    <span className="dot">•</span>
                                    <p className="comment-timestamp">
                                        {comment.timeStamp}
                                    </p>
                                </div>
                                <p className="comment-text">
                                    {comment.comment}
                                </p>
                            </div>
                        ))
                    ) : (
                        <></>
                    )}
                    <input
                        onChange={getComment}
                        onKeyPress={handleKeyPress}
                        name="comment"
                        placeholder="Add a Comment"
                        className="comment-input"
                        value={comment}
                    ></input>
                    <button
                        className="comment-btn"
                        onClick={uploadComment}
                        type="primary"
                        disabled={comment.length > 0 ? false : true}
                    >
                        Comment
                    </button>
                </>
            ) : (
                <></>
            )}
        </div>
    );
}
