import { db, auth } from "../FirebaseConfig";
import {
    addDoc,
    collection,
    onSnapshot,
    doc,
    updateDoc,
    query,
    where,
    getDocs,
    setDoc,
    deleteDoc,
} from "firebase/firestore";
import { deleteFile } from "./ImageUpload";
import { toast } from "react-toastify";

let dbRef = collection(db, "posts"); //this is the reference to the posts postRef
let userRef = collection(db, "users");
let likeRef = collection(db, "likes");
let commentRef = collection(db, "comments");
let connectionRef = collection(db, "connections");
let resumeRef = collection(db, "resumes");
let messageRef = collection(db, "messages");

export const postStatus = (obj) => {
    addDoc(dbRef, obj)
        .then(() => {
            toast.info("Post Created");
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getStatus = (setAllStatus) => {
    onSnapshot(dbRef, (response) => {
        setAllStatus(
            response.docs.map((docs) => {
                return { ...docs.data(), id: docs.id };
            })
        );
    });
};

export const postUserData = async (obj) => {
    try {
        const userSnapshot = await getDocs(
            query(userRef, where("email", "==", obj.email))
        );
        if (!userSnapshot.empty) {
            toast.info("Welcome Back");
            return;
        }

        await addDoc(userRef, obj);
        addConnection();
        toast.info("User Created");
    } catch (error) {
        console.log(error);
    }
};

export const getCurrentUser = (setUserData) => {
    let currmail = localStorage.getItem("userEmail");
    onSnapshot(userRef, (response) => {
        setUserData(
            response.docs
                .map((docs) => {
                    return { ...docs.data(), userid: docs.id };
                })
                .filter((user) => {
                    return user.email === localStorage.getItem("userEmail");
                })[0]
        );
    });
};

export const editProfile = (userID, payLoad) => {
    let userToEdit = doc(userRef, userID);

    updateDoc(userToEdit, payLoad)
        .then(() => {
            toast.info("Profile Updated");
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getSingleStatus = (setAllStatus, id) => {
    const singlePostQuery = query(dbRef, where("userID", "==", id));
    onSnapshot(singlePostQuery, (response) => {
        setAllStatus(
            response.docs.map((docs) => {
                return { ...docs.data(), id: docs.id };
            })
        );
    });
};

export const getSingleUser = (setCurrentUser, email) => {
    const singleUserQuery = query(userRef, where("email", "==", email));
    onSnapshot(singleUserQuery, (response) => {
        setCurrentUser(
            response.docs.map((docs) => {
                return { ...docs.data(), id: docs.id };
            })[0]
        );
    });
};

export const getAllUsers = (setAllUsers) => {
    onSnapshot(userRef, (response) => {
        setAllUsers(
            response.docs.map((docs) => {
                return { ...docs.data(), id: docs.id };
            })
        );
    });
};

export const likePost = (userId, postId, liked) => {
    try {
        let docToLike = doc(likeRef, `${userId}_${postId}`);

        if (liked) {
            deleteDoc(docToLike);
        } else {
            setDoc(docToLike, { postId, userId });
        }
    } catch (err) {
        console.log(err);
    }
};

export const getLikesByUser = (userId, postId, setLiked, setLikesCount) => {
    try {
        let likeQuery = query(likeRef, where("postId", "==", postId));
        onSnapshot(likeQuery, (response) => {
            let likes = response.docs.map((doc) => doc.data());
            // console.log(likes);

            let likesCount = likes?.length;
            const isLiked = likes.some((like) => like.userId === userId);

            // console.log(likesCount);
            setLikesCount(likesCount);
            setLiked(isLiked);
        });
    } catch (err) {
        console.log(err);
    }
};

export const postComment = (postId, userId, comment, timeStamp, email) => {
    try {
        addDoc(commentRef, { postId, userId, comment, timeStamp, email });
    } catch (err) {
        console.log(err);
    }
};
export const getComments = (postId, setShowComments) => {
    try {
        let commentQuery = query(commentRef, where("postId", "==", postId));
        onSnapshot(commentQuery, (response) => {
            // setComments(response.docs.map((doc) => doc.data()));
            const comments = response.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            });
            setShowComments(comments);
        });
    } catch (err) {
        console.log(err);
    }
};

export const updatePost = (id, status, postImage) => {
    let docToUpdate = doc(dbRef, id);

    try {
        updateDoc(docToUpdate, { status, postImage });
        toast.info("Post has been Updated");
    } catch (err) {
        console.log(err);
    }
};

export const deletePost = (id) => {
    let docToDelete = doc(dbRef, id);
    try {
        deleteDoc(docToDelete);
        toast.info("Post has been Deleted");
    } catch (error) {
        console.log(error);
    }
};

export const addConnection = (userId, targetId) => {
    try {
        let connectionAdd = doc(connectionRef, `${userId}_${targetId}`);

        setDoc(connectionAdd, { userId, targetId });

        toast.info("Connection Added");
    } catch (err) {
        console.log(err);
    }
};

export const getConnections = (userId, targetId, setIsConnected) => {
    try {
        let ConnectionQuery = query(
            connectionRef,
            where("targetId", "==", targetId)
        );
        onSnapshot(ConnectionQuery, (response) => {
            let connections = response.docs.map((doc) => doc.data());
            const isConnected = connections.some(
                (connection) => connection.userId === userId
            );

            // console.log(likesCount);
            setIsConnected(isConnected);
        });
    } catch (err) {
        console.log(err);
    }
};

export const addResume = async (resumeData) => {
    try {
        const resumeSnapshot = await getDocs(
            query(resumeRef, where("name", "==", resumeData.name))
        );

        if (!resumeSnapshot.empty) {
            toast.warning("A resume with the same name already exists");
            return;
        }

        await addDoc(resumeRef, resumeData);
        toast.info("Resume added successfully");
    } catch (error) {
        console.error("Error adding resume:", error);
        toast.error("Failed to add resume");
    }
};

export const saveMessage = (
    senderId,
    senderName,
    receiverId,
    timeStamp,
    message,
    fileUrl
) => {
    try {
        addDoc(messageRef, {
            senderId,
            senderName,
            receiverId,
            timeStamp,
            message,
            fileUrl,
        });
    } catch (err) {
        console.log(err);
    }
};

export const getAllMessages = (senderId, receiverId, setMessages) => {
    try {
        let messageQuery = query(
            messageRef,
            where("senderId", "in", [senderId, receiverId]), // Use array comparison
            where("receiverId", "in", [senderId, receiverId])
        );
        onSnapshot(messageQuery, (response) => {
            // setComments(response.docs.map((doc) => doc.data()));
            const messages = response.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            });
            setMessages(messages);
        });
    } catch (err) {
        console.log(err);
    }
};

export const removeConnection = (userId, targetId) => {
    let docToDelete = doc(connectionRef, `${userId}_${targetId}`);
    try {
        deleteDoc(docToDelete);
        toast.info("Connection Removed");
    } catch (error) {
        console.log(error);
    }
};

export const deleteFirestoreData = async (userId) => {
    try {
        const userDocRef = doc(collection(db, "users"), userId);
        await deleteDoc(userDocRef);

        const userPostsQuery = query(
            collection(db, "posts"),
            where("userID", "==", userId)
        );
        const userPostsSnapshot = await getDocs(userPostsQuery);
        userPostsSnapshot.forEach(async (doc) => {
            await deleteFile(doc.data().postImage);
            await deleteDoc(doc.ref);
        });

        const userLikesQuery = query(
            collection(db, "likes"),
            where("userId", "==", userId)
        );
        const userLikesSnapshot = await getDocs(userLikesQuery);
        userLikesSnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });

        const userCommentsQuery = query(
            collection(db, "comments"),
            where("userId", "==", userId)
        );
        const userCommentsSnapshot = await getDocs(userCommentsQuery);
        userCommentsSnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });

        const userConnectionsQuery = query(
            collection(db, "connections"),
            where("userId", "==", userId)
        );
        const userConnectionsSnapshot = await getDocs(userConnectionsQuery);
        userConnectionsSnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });

        const userMessagesQuery = query(
            collection(db, "messages"),
            where("senderId", "==", userId)
        );
        const userMessagesSnapshot = await getDocs(userMessagesQuery);
        userMessagesSnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });

        const receiverMessagesQuery = query(
            collection(db, "messages"),
            where("receiverId", "==", userId)
        );
        const receiverMessagesSnapshot = await getDocs(receiverMessagesQuery);
        receiverMessagesSnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });

        console.log("Firestore data deleted successfully");
    } catch (error) {
        console.error("Error deleting user data:", error);
    }
};

export const getAllFollowers = async (userId, setFollowers) => {
    try {
        const followersQuery = query(
            connectionRef,
            where("targetId", "==", userId)
        );
        onSnapshot(followersQuery, (response) => {
            const matchingUsers = response.docs.map((doc) => doc.data().userId);

            onSnapshot(userRef, (response) => {
                const followers = response.docs.filter((doc) =>
                    matchingUsers.includes(doc.id)
                );

                setFollowers(
                    followers.map((doc) => ({ ...doc.data(), id: doc.id }))
                );
            });
        });
    } catch (error) {
        console.log(error);
    }
};

export const getAllFollowing = async (userId, setFollowing) => {
    try {
        const followingQuery = query(
            connectionRef,
            where("userId", "==", userId)
        );
        onSnapshot(followingQuery, (response) => {
            const matchingUsers = response.docs.map(
                (doc) => doc.data().targetId
            );
            // console.log(matchingUsers);

            onSnapshot(userRef, (response) => {
                const following = response.docs.filter((doc) =>
                    matchingUsers.includes(doc.id)
                );

                setFollowing(
                    following.map((doc) => ({ ...doc.data(), id: doc.id }))
                );
            });
        });
    } catch (error) {
        console.log(error);
    }
};

export const getUserById = async (email) => {
    try {
        // get userdata from userRef comparing emailid
        const userDoc = await getDocs(
            query(userRef, where("email", "==", email))
        );
        return userDoc.docs[0].data();
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error; // Propagate the error to the caller
    }
};
