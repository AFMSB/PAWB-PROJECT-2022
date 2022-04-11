import {Link} from "react-router-dom";
import React, {Component} from "react";
import NavbarProfile from "./NavbarProfile";

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">PAW - GeoLocator</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <ul className="navbar-nav me-auto mb-2 mb-md-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/sign-in">Sign In</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/sign-up">Sign Up</Link>
                            </li>
                        </ul>
                        <NavbarProfile/>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;
