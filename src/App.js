import React from 'react';
import './css/App.css';
import {Routes, Route} from "react-router-dom";

import Login from "./components/Signin";
import Signup from "./components/Signup";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";




function App() {
    return (
        <div className="App">
            <Navbar />
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <Routes>
                        <Route exact path='/' element={<Login/>}/>
                        <Route path="/sign-in" element={<Login/>}/>
                        <Route path="/sign-up" element={<Signup/>}/>
                    </Routes>
                </div>
            </div>
            <div className="b-example-divider">

            </div>
            <Footer />
        </div>
    );
}

export default App;