import React from 'react';
import './css/App.css';
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";

import Login from "./components/login.component";
import SignUp from "./components/signup.component";

function App() {
    return (<div className="App">
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
                        <div className="dropdown text-lg-end d-flex justify-content-center">
                            <a href="#" className="d-block link-dark text-decoration-none dropdown-toggle"
                               id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src={process.env.PUBLIC_URL+"unknown.png"} alt="mdo" width="32" height="32"
                                     className="rounded-circle"/>
                            </a>
                            <ul className="dropdown-menu text-small dropdown-menu-end" aria-labelledby="dropdownUser1">
                                <li><Link className="dropdown-item disabled" to="/sign-in">Username</Link></li>
                                <li><Link className="dropdown-item" to="/sign-in">Profile</Link></li>
                                <li>
                                    <hr className="dropdown-divider"/>
                                </li>
                                <li><Link className="dropdown-item" to="#">Sign Out</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <Routes>
                        <Route exact path='/' element={<Login/>}/>
                        <Route path="/sign-in" element={<Login/>}/>
                        <Route path="/sign-up" element={<SignUp/>}/>
                    </Routes>
                </div>
            </div>
            <div className="b-example-divider">

            </div>
            <footer className="py-3 my-4 bg-light">
                <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                    <li className="nav-item"><a target="_blank" href="https://www.linkedin.com/in/andre-filipe-batista/" className="nav-link px-2 text-muted">André Batista</a></li>
                    <li className="nav-item"><a target="_blank" href="https://www.linkedin.com/in/jorge-lopes-pt/" className="nav-link px-2 text-muted">Jorge Lopes</a></li>
                </ul>
                <p className="text-center text-muted">© 2022 Universidade Fernando Pessoa, UFP</p>
            </footer>

        </div>
    );
}

export default App;