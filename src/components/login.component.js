import React, {Component} from "react";

export default class Login extends Component {
    render() {
        return (
            <form>
                <h3>Sign In</h3>

                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control" placeholder="Username" required/>
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" required/>
                </div>

                <div className="form-check mb-3">
                    <input type="checkbox" className="form-check-input" id="customCheck1"/>
                    <label className="form-check-label" htmlFor="customCheck1">Remember me</label>
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>
            </form>
        );
    }
}