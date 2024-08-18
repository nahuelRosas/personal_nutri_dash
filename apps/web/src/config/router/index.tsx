import { Navigate, createBrowserRouter } from "react-router-dom";

import AuthPage from "@/pages/auth/authPage";
import CreateAccount from "@/pages/auth/createAccount";
import Login from "@/pages/auth/login";
import ProtectedRoute from "@/pages/auth/protectedRoute";
import Home from "@/pages/home/home";
import Providers from "@/providers/providers";

import Root from "@pages/Root";
import NutrigeneticDashboard from "@/pages/nutrigenetic/nutrigenetic";
import ProductsRecommended from "@/pages/product/products";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Providers />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Root />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "nutrigenetic",
            element: <NutrigeneticDashboard />,
          },
          {
            path: "product-recommender",
            element: <ProductsRecommended />,
          },
        ],
      },
      {
        path: "/auth",
        element: <AuthPage />,
        children: [
          {
            index: true,
            element: <Login />,
          },
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <CreateAccount />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

export default router;
