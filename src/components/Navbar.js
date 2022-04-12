import {Link} from "react-router-dom";
import React, {Component} from "react";
import NavbarProfile from "./NavbarProfile";
import NavbarLinks from "./NavbarLinks";

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
                        <NavbarLinks/>
                        <NavbarProfile/>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;
