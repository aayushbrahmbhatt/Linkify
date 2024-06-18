import React, { useState } from "react";
import { RegisterAPI, GoogleAPI } from "../API/AuthAPI";
import ConnectLogo from "../assets/ConnectLogo.png";
import GoogleButton from "react-google-button";
import "../Scss/LoginComponent.scss";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { postUserData } from "../API/FirestoreAPI";
import { getUniqueID } from "../helpers/getUniqueID";
import { sendEmailVerification } from "firebase/auth";

export default function SignupComponent() {
    const [credentails, setCredentials] = useState({});

    let navigate = useNavigate();

    const register = async () => {
        try {
            let response = await RegisterAPI(
                credentails.email,
                credentails.password
            );
            sendEmailVerification(response.user);
            toast.info("Email Verification Link is Sent to Your Email");
            postUserData({
                name: credentails.name,
                email: credentails.email,
                userID: getUniqueID(),
                college: "Add Institute Name",
                headline: "Add Headline",
                city: "Add City",
                country: "Add Country",
            });
            navigate("/Home");
            // console.log(response) ;
            localStorage.setItem("userEmail", response.user.email);
        } catch (error) {
            // toast.error({ error });
            toast.error(`Error: ${error.message}`);
        }
    };
    const googleLogin = () => {
        try {
            let response = GoogleAPI();
            // console.log("Google Response : ", response);
            // toast.info("Login Successfully");
        } catch (error) {
            toast.error("Invalid Email or Password");
        }
    };

    return (
        <div className="login-wrapper">
            <img src={ConnectLogo} className="connectLogo" />

            <div className="login-wrapper-inner">
                <h1 className="heading">Sign Up</h1>
                <p className="sub-heading">Let's get started</p>

                <div className="auth-input">
                    <input
                        onChange={(e) =>
                            setCredentials({
                                ...credentails,
                                name: e.target.value,
                            })
                        }
                        type="text"
                        className="common-input"
                        placeholder="Name"
                        required
                    />

                    <input
                        onChange={(e) =>
                            setCredentials({
                                ...credentails,
                                email: e.target.value,
                            })
                        }
                        type="email"
                        className="common-input"
                        placeholder="Email"
                        required
                    />

                    <input
                        onChange={(e) =>
                            setCredentials({
                                ...credentails,
                                password: e.target.value,
                            })
                        }
                        type="password"
                        className="common-input"
                        placeholder="Password (6 or more characters)"
                        required
                    />
                </div>

                <button className="login-btn" onClick={register}>
                    Create Account
                </button>
            </div>
            <hr className="hr-text" data-content="or" />
            <div className="google-btn-container">
                <GoogleButton className="google-btn" onClick={googleLogin} />
                <p className="signup-link">
                    Already have an account?{" "}
                    <span className="register" onClick={() => navigate("/")}>
                        Log In
                    </span>
                </p>
            </div>
        </div>
    );
}
