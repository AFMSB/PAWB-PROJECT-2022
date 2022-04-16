import { Navigate, Outlet } from "react-router";

const useAuth = () => {
    const user = { loggedIn: localStorage.getItem("authToken"), access: localStorage.getItem("access")};
    return user && user.loggedIn && user.access==="-1";
};

const AdminProtectedRoutes = () => {
    const isAuth = useAuth ();
    return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default AdminProtectedRoutes;