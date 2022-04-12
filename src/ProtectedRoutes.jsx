import { Navigate, Outlet } from "react-router";

const useAuth = () => {
    const user = { loggedIn: localStorage.getItem("authToken") };
    return user && user.loggedIn;
};

const ProtectedRoutes = () => {
    const isAuth = useAuth ();
    return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;