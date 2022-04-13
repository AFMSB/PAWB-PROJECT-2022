import React from 'react';
import './css/App.css';
import {Routes, Route} from "react-router-dom";

import Login from "./components/Signin";
import Signup from "./components/Signup";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoutes from "./ProtectedRoutes";
import Profile from "./components/Profile";
import Home from "./components/Home";



function App() {
    return (
        <div className="App">
            <Navbar/>
            <Routes>
                <Route exact path='/' element={<Home/>}/>
                <Route path="/sign-in" element={<Login/>}/>
                <Route path="/sign-up" element={<Signup/>}/>
                <Route element={<ProtectedRoutes/>}>
                    <Route path="/profile" element={<Profile/>}/>
                </Route>
            </Routes>
            <Footer/>
        </div>
    );
}

export default App;