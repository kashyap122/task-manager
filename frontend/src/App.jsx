import { createBrowserRouter, Outlet, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Error from "./components/Error";
import Body from "./components/Body.jsx";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import "primeicons/primeicons.css";
import { useEffect } from "react";
import { AuthProvider } from "./utils/AuthContext.jsx";
import "react-toastify/dist/ReactToastify.css";

export const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
    <AuthProvider>
      <Header />
      <Outlet />
      </AuthProvider>
    </>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Body />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
]);

export default appRouter;
