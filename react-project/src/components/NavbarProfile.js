import {Link, useNavigate} from "react-router-dom";
import React from "react";
import AuthService from "../services/auth.service";

const NavbarProfile = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        AuthService.logout().then(
            () => {
                navigate("/sign-in");
                window.location.reload();
            }
        );
    };

    const isAuthenticated = localStorage.getItem("authToken");
    if (isAuthenticated) {
        return (
            <div className="dropdown text-lg-end d-flex justify-content-center" id="navbar-profile">
                <a href="#" className="d-block link-dark text-decoration-none dropdown-toggle"
                   id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="mdo" width="32" height="32"/>
                </a>
                <ul className="dropdown-menu text-small dropdown-menu-end" aria-labelledby="dropdownUser1">
                    <li><Link className="dropdown-item disabled" to="/sign-in">{localStorage.getItem("username").replaceAll('"', '')}</Link></li>
                    <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                    <li>
                        <hr className="dropdown-divider"/>
                    </li>
                    <li><a className="dropdown-item text-danger" onClick={handleSignOut}>Sign Out</a></li>
                </ul>
            </div>
        )
    } else {
        return (
            <div/>
        );
    }

}
export default NavbarProfile;
