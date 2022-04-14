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
                    <img src={process.env.PUBLIC_URL + "../assets/profile.png"} alt="mdo" width="32" height="32"
                         className="rounded-circle"/>
                </a>
                <ul className="dropdown-menu text-small dropdown-menu-end" aria-labelledby="dropdownUser1">
                    <li><Link className="dropdown-item disabled" to="/sign-in">Username</Link></li>
                    <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                    <li>
                        <hr className="dropdown-divider"/>
                    </li>
                    <li><a className="dropdown-item" onClick={handleSignOut}>Sign Out</a></li>
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
