import React, { useState } from "react";
import { LoginAPI, GoogleAPI } from "../API/AuthAPI";
import ConnectLogo from "../assets/ConnectLogo.png";
import GoogleButton from "react-google-button";
import { Modal, Input, Button, message } from "antd";
import "../Scss/LoginComponent.scss";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../FirebaseConfig";

export default function LoginComponent() {
    const [credentials, setCredentials] = useState({});
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
    const [forgotPasswordModalVisible, setForgotPasswordModalVisible] =
        useState(false);

    let navigate = useNavigate();

    const login = async () => {
        try {
            let response = await LoginAPI(
                credentials.email,
                credentials.password
            );
            toast.info("Login Successfully");
            localStorage.setItem("userEmail", response.user.email);
            navigate("/Home");
        } catch (error) {
            toast.error("Invalid Email or Password");
        }
    };

    const googleLogin = () => {
        try {
            let response = GoogleAPI();
        } catch (error) {
            message.error("Invalid Email or Password");
        }
    };

    const showForgotPasswordModal = () => {
        setForgotPasswordModalVisible(true);
    };

    const handleForgotPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, forgotPasswordEmail);
            toast.info("Password reset link is sent to your email");
            handleCancel();
        } catch (error) {
            console.error("Error sending password reset email:", error);
            toast.error(
                "Failed to send password reset instructions. Please try again later."
            );
        }
    };

    const handleCancel = () => {
        setForgotPasswordEmail("");
        setForgotPasswordModalVisible(false);
    };

    return (
        <div className="login-wrapper">
            <img src={ConnectLogo} className="connectLogo" />

            <div className="login-wrapper-inner">
                <h1 className="heading">Log In</h1>
                <p className="sub-heading">Welcome to Linkify</p>

                <div className="auth-input">
                    <Input
                        onChange={(e) =>
                            setCredentials({
                                ...credentials,
                                email: e.target.value,
                            })
                        }
                        type="email"
                        className="common-input"
                        placeholder="Email or Phone"
                    />

                    <Input.Password
                        onChange={(e) =>
                            setCredentials({
                                ...credentials,
                                password: e.target.value,
                            })
                        }
                        className="common-input"
                        placeholder="Enter your Password"
                    />
                </div>

                <Button className="login-btn" onClick={login}>
                    Log In
                </Button>
            </div>
            <hr className="hr-text" data-content="or" />

            <div className="google-btn-container">
                <GoogleButton className="google-btn" onClick={googleLogin} />
                <p className="signup-link">
                    Don't have an account?{" "}
                    <span
                        className="register"
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </span>
                </p>
            </div>
            <Button
                className="forgot-password-btn"
                onClick={showForgotPasswordModal}
            >
                Forgot Password?
            </Button>

            <Modal
                title="Forgot Your Password?"
                visible={forgotPasswordModalVisible}
                onOk={handleForgotPassword}
                onCancel={handleCancel}
                okText="Reset your password"
                cancelText="Cancel"
            >
                <p>
                    Enter your email address below and we'll send you
                    instructions on how to reset your password.
                </p>
                <Input
                    type="email"
                    placeholder="Enter your email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                />
            </Modal>
        </div>
    );
}
