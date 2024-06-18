import { storage } from "../FirebaseConfig";
import {
    ref,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject,
} from "firebase/storage";
import { editProfile } from "./FirestoreAPI";
import { getUniqueID } from "../helpers/getUniqueID";
import { toast } from "react-toastify";

// Function to upload image and delete current image
export const uploadImage = (
    file,
    id,
    setModalOpen,
    setProgress,
    setCurrentImage,
    currentImageLink // Pass current image link
) => {
    const profilePicsRef = ref(storage, `profileImages/${id}`);
    const uploadTask = uploadBytesResumable(profilePicsRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
        },
        (err) => {
            console.error(err);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((response) => {
                // Delete current image if exists
                if (currentImageLink) {
                    const currentImageRef = ref(storage, currentImageLink);
                    deleteObject(currentImageRef)
                        .then(() => {
                            console.log("Current image deleted successfully");
                        })
                        .catch((error) => {
                            console.error(
                                "Error deleting current image:",
                                error
                            );
                        });
                }

                // Update profile image link
                editProfile(id, { imageLink: response });
                setModalOpen(false);
                setCurrentImage({});
                setProgress(0);
            });
        }
    );
};

export const deleteImage = (id) => {
    // Create a reference to the image in Firebase storage
    const imageRef = ref(storage, `profileImages/${id}`);

    // Delete the image from Firebase storage
    return deleteObject(imageRef)
        .then(() => {
            console.log("Image deleted successfully");
            editProfile(id, { imageLink: "" });
        })
        .catch((error) => {
            console.error("Error deleting image:", error);
        });
};

export const uploadPostImage = (file, setPostImage, setProgress) => {
    // const postPicsRef = ref(storage, `postImages/${file.name}`);
    const postPicsRef = ref(storage, `postImages/${getUniqueID()}`);
    const uploadTask = uploadBytesResumable(postPicsRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
        },
        (err) => {
            console.error(err);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((response) => {
                setPostImage(response);
            });
        }
    );
};

export const uploadResume = (file, id, setProgress, setResume) => {
    const resumeRef = ref(storage, `resumes/${id}_${file.name}`);
    const uploadTask = uploadBytesResumable(resumeRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
            console.log(progress);
        },
        (err) => {
            console.error(err);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then(() => {
                setResume(null);
                setProgress(0);
            });
        }
    );
};

export const deleteFile = (fileUrl) => {
    // Create a reference to the image in Firebase storage
    const fileRef = ref(storage, fileUrl);

    // Delete the image from Firebase storage
    return deleteObject(fileRef)
        .then(() => {
            toast.info("File removed successfully");
        })
        .catch((error) => {
            console.error("Error deleting image:", error);
        });
};

export const uploadMessageFile = (file, setFileUrl, setProgress) => {
    const fileRef = ref(storage, `files/${getUniqueID()}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            // console.log(progress);
            setProgress(progress);
        },
        (err) => {
            console.error(err);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((response) => {
                setFileUrl(response);
                toast.info("File uploaded successfully");
            });
        }
    );
};
