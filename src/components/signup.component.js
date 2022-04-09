import React, {Component} from "react";

export default class SignUp extends Component {




    render() {
        return (
            <form>
                <h3>Sign Up</h3>

                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control" placeholder="Username" required/>
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" minLength="6" required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" placeholder="Enter confirm password" minLength="6" required/>
                </div>

                <button type="submit" className="btn btn-primary">Sign Up</button>
                <p className="forgot-password text-right">
                    Already registered <a href="#">sign in?</a>
                </p>
            </form>
        );
    }
}