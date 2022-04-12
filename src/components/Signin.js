import React, {useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";

const required = (value) => {
    if (!value) {
        return (
            <div className="invalid-feedback d-block">
                This field is required!
            </div>
        );
    }
};
const Login = () => {
    const form = useRef();
    const checkBtn = useRef();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };
    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };
    const handleLogin = (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);
        form.current.validateAll();
        if (checkBtn.current.context._errors.length === 0) {
            AuthService.login(username, password).then(
                () => {
                    navigate("/profile");
                    window.location.reload();
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    setLoading(false);
                    setMessage(resMessage);
                }
            );
        } else {
            setLoading(false);
        }
    };
    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <Form onSubmit={handleLogin} ref={form}>
                    <img
                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                        alt="profile-img"
                        className="profile-img-card"
                    />
                    <h3>Sign In</h3>

                    {message && (
                        <div className="form-group">
                            <div className="alert alert-danger" role="alert">
                                {message}
                            </div>
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <Input
                            type="text"
                            className="form-control"
                            name="username"
                            placeholder="Username"
                            required
                            value={username}
                            onChange={onChangeUsername}
                            validations={[required]}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <Input
                            type="password"
                            className="form-control"
                            name="password"
                            placeholder="Enter password"
                            required
                            value={password}
                            onChange={onChangePassword}
                            validations={[required]}
                        />
                    </div>

                    <div className="form-check mb-3">
                        <input type="checkbox" className="form-check-input" id="customCheck1"/>
                        <label className="form-check-label" htmlFor="customCheck1">Remember me</label>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading && (
                            <span className="spinner-border spinner-border-sm me-3"/>
                        )}
                        <span>Login</span></button>
                    <p className="forgot-password text-right">
                        Forgot <a href="#">password?</a>
                    </p>

                    <CheckButton style={{display: "none"}} ref={checkBtn}/>
                </Form>
            </div>
        </div>
    );
};
export default Login;
