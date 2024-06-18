import React, { useState, useEffect } from "react";
import { editProfile } from "../../../API/FirestoreAPI";
import { UpdatePassword } from "../../../API/AuthAPI";
import { toast } from "react-toastify";
import "./index.scss";
import { updatePassword } from "firebase/auth";
import { auth } from "../../../FirebaseConfig";

export default function ProfileEdit({ currentUser, onEdit }) {
    const [editInputs, setEditInputs] = useState({});
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changePassword, setChangePassword] = useState(false);

    useEffect(() => {
        setEditInputs({
            name: currentUser.name || "",
            headline: currentUser.headline || "",
            country: currentUser.country || "",
            city: currentUser.city || "",
            company: currentUser.company || "",
            college: currentUser.college || "",
            industry: currentUser.industry || "",
            website: currentUser.website || "",
            skills: currentUser.skills || "",
            aboutme: currentUser.aboutme || "",
        });
    }, [currentUser]);

    const getInput = (event) => {
        let { name, value } = event.target;
        let input = { [name]: value };
        setEditInputs({ ...editInputs, ...input });
    };

    const updateProfileData = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (changePassword && newPassword !== "") {
            try {
                await updatePassword(auth.currentUser, newPassword);
                toast.info("Password updated successfully");
            } catch (error) {
                console.error("Error updating password:", error);
                toast.error(`${error.message}`);
                return;
            }
        }

        await editProfile(currentUser?.userid, editInputs);
        await onEdit();
    };

    const handleCheckboxChange = (e) => {
        setChangePassword(e.target.checked);
        if (!e.target.checked) {
            setNewPassword("");
            setConfirmPassword("");
        }
    };

    return (
        <div className="profileEdit">
            <div className="edit-btn">
                <button onClick={onEdit}>Back</button>
            </div>
            <div className="profileEditInputs">
                <label>Name</label>
                <input
                    onChange={getInput}
                    className="common-input"
                    placeholder={currentUser.name ? currentUser.name : "Name"}
                    name="name"
                    value={editInputs.name}
                />
                <label>Headline</label>
                <input
                    onChange={getInput}
                    className="common-input"
                    placeholder={
                        currentUser.headline ? currentUser.headline : "Headline"
                    }
                    name="headline"
                    value={editInputs.headline}
                />
                <label>Country</label>
                <input
                    onChange={getInput}
                    className="common-input"
                    placeholder={
                        currentUser.country ? currentUser.country : "Country"
                    }
                    name="country"
                    value={editInputs.country}
                />
                <label>City</label>
                <input
                    onChange={getInput}
                    className="common-input"
                    placeholder={currentUser.city ? currentUser.city : "City"}
                    name="city"
                    value={editInputs.city}
                />
                <label>Company</label>
                <input
                    onChange={getInput}
                    className="common-input"
                    placeholder={
                        currentUser.company ? currentUser.company : "Company"
                    }
                    name="company"
                    value={editInputs.company}
                />
                <label>Industry</label>
                <input
                    onChange={getInput}
                    className="common-input"
                    placeholder={
                        currentUser.industry ? currentUser.industry : "Industry"
                    }
                    name="industry"
                    value={editInputs.industry}
                />
                <label>College</label>
                <input
                    onChange={getInput}
                    className="common-input"
                    placeholder={
                        currentUser.college ? currentUser.college : "College"
                    }
                    name="college"
                    value={editInputs.college}
                />

                <label>Website</label>
                <input
                    onChange={getInput}
                    className="common-input"
                    placeholder={
                        currentUser.website ? currentUser.website : "Website"
                    }
                    name="website"
                    value={editInputs.website}
                />

                <label>Skills</label>
                <input
                    onChange={getInput}
                    className="common-input"
                    placeholder={
                        currentUser.skills ? currentUser.skills : "Skill"
                    }
                    name="skills"
                    value={editInputs.skills}
                />

                <label>About</label>
                <textarea
                    className="common-textArea"
                    onChange={getInput}
                    placeholder={
                        currentUser.aboutme ? currentUser.aboutme : "About Me"
                    }
                    name="aboutme"
                    value={editInputs.aboutme}
                />

                <label className="password-label">
                    <div className="checkbox-wrapper">
                        <span>Change Password</span>
                        <input
                            type="checkbox"
                            checked={changePassword}
                            className="password-checkbox"
                            onChange={handleCheckboxChange}
                        />
                    </div>
                </label>

                {changePassword && (
                    <>
                        <label>New Password</label>
                        <input
                            type="password"
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="common-input"
                            placeholder="New Password"
                            value={newPassword}
                        />
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="common-input"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                        />
                    </>
                )}
            </div>
            <button className="save-btn" onClick={updateProfileData}>
                Save
            </button>
        </div>
    );
}
