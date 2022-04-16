import {Link} from "react-router-dom";
import React, {Component} from "react";

const NavbarLinks = () => {
    const isAuthenticated = localStorage.getItem("authToken");
    const accessMode = localStorage.getItem("access")
    if (isAuthenticated && accessMode === "-1") {  //Admin
        return (<ul className="navbar-nav me-auto mb-2 mb-md-0">
                <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
            </ul>
        );
    }  if (isAuthenticated && accessMode === "1") { // User
        return (<ul className="navbar-nav me-auto mb-2 mb-md-0"/>);
    } else{
        return (
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
                <li className="nav-item">
                    <Link className="nav-link" to="/sign-in">Sign In</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/sign-up">Sign Up</Link>
                </li>
            </ul>
        );
    }
}

export default NavbarLinks;
