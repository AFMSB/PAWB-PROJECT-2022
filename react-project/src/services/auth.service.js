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
            }
            return response.data;
        })
        .catch(error => {
            console.log(error);
        });
};
const logout = () => {
    const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"','')}`}
    console.log(headers)

    return axios.post(API_URL + "logout",{
        headers: headers
    }).then((response) => {
        if(response.status===200){
            localStorage.removeItem("authToken");
        }
        return response.data;
    }).catch(error => {
        console.log(error);
    });

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