import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyEmail from "./components/VerifyEmail";
import OrderSuccess from "./components/OrderSuccess";
import Loading from "./components/Loading";
const Home = lazy(() => import("./pages/Home"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Verify = lazy(() => import("./pages/Verify"));
const Products = lazy(() => import("./pages/Products"));
const Cart = lazy(() => import("./pages/Cart"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminSales = lazy(() => import("./pages/admin/AdminSales"));
const AddProduct = lazy(() => import("./pages/admin/AddProduct"));
const AdminProduct = lazy(() => import("./pages/admin/AdminProduct"));
const AdminOders = lazy(() => import("./pages/admin/AdminOders"));
const ShowUserOrders = lazy(() => import("./pages/admin/ShowUserOrders"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const UserInfo = lazy(() => import("./pages/admin/UserInfo"));
import SingleProduct from "./pages/SingleProduct"
// const SingleProduct = lazy(() => import("./pages/SingleProduct"));
const AddressForm = lazy(() => import("./pages/AddressForm"));
const MyOrder = lazy(() => import("./pages/MyOrder"));
const Profile = lazy(() => import("./components/Profile"));

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },

      { path: "/products", element: <Products /> },
      { path: "/products/:id", element: <SingleProduct /> },

      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },

      {
        path: "/orders",
        element: (
          <ProtectedRoute>
            <MyOrder />
          </ProtectedRoute>
        ),
      },

      {
        path: "/profile/:userId",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute adminOnly={true}>
        <Navbar/>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      { path: "sales", element: <AdminSales /> },
      { path: "add-product", element: <AddProduct /> },
      { path: "products", element: <AdminProduct /> },
      { path: "orders", element: <AdminOders /> },
      { path: "users", element: <AdminUsers /> },
      { path: "users/:id", element: <UserInfo /> },
      { path: "users/orders/:userId", element: <ShowUserOrders /> },
    ],
  },

  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { path: "/verify", element: <Verify /> },
  { path: "/verify/:token", element: <VerifyEmail /> },

  {
    path: "/address",
    element: (
      <ProtectedRoute>
        <AddressForm />
      </ProtectedRoute>
    ),
  },

  {
    path: "/order-success",
    element: (
      <ProtectedRoute>
        <OrderSuccess />
      </ProtectedRoute>
    ),
  },
]);

const App = () => {
  return (
    <Suspense fallback={<Loading/>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;