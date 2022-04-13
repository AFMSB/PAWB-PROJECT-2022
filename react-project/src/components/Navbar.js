import React, {Component} from "react";
import NavbarProfile from "./NavbarProfile";
import NavbarLinks from "./NavbarLinks";
import {Link} from "react-router-dom";

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">PAW - GeoLocator</Link>
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
