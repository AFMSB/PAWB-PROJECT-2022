import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/auth/";
const register = (username, password, confirmPassword) => {
    return axios.post(API_URL + "register", {
        username,
        password,
        confirmPassword,
    });
};
const login = (username, password) => {
    return axios
        .post(API_URL + "login", {
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
    const response = await fetch(API_URL + "logout", requestOptions);
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