import axios from "axios";
import {BASE_URL} from "../index";
const register = (username, password, confirmPassword) => {
    return axios.post(BASE_URL + "/auth/register", {
        username,
        password,
        confirmPassword,
    });
};
const login = (username, password) => {
    return axios
        .post(BASE_URL + "/auth/login", {
            username,
            password,
        })
        .then((response) => {
            if (response.status === 200) {
                localStorage.setItem("authToken", JSON.stringify(response.data.token));
                localStorage.setItem("username", JSON.stringify(response.data.username));
                localStorage.setItem("access", JSON.stringify(response.data.access));
                localStorage.setItem("uid", JSON.stringify(response.data.uid));
            }
            return response.data;
        })
        .catch(error => {
            console.log(error);
        });
};
const logout = async () => {
    const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}
    const requestOptions = {
        method: 'POST',
        headers: headers
    };
    const response = await fetch(BASE_URL + "/auth/logout", requestOptions);
    const data = await response.json();
    if (data.status === 200) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("access");
        localStorage.removeItem("username");
        localStorage.removeItem("uid");
        return response.data;
    }
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};
const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
}
export default AuthService;