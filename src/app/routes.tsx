// src/app/routes.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 새로 추가된 페이지들
import LoginPage from "@/pages/Authentication/LoginPage";
import SignupPage from "@/pages/Authentication/SignupPage";
import ProductsSellerPage from "@/pages/Seller/ProductsSellerPage";
import ProductDetailPage from "@/pages/Seller/ProductDetailPage";
import ProductRegistrationPage from "@/pages/Seller/ProductRegistrationPage";
import ProductsBuyerPage from "@/pages/Buyer/ProductsBuyerPage";
import RequestListPage from "@/pages/Broker/RequestListPage";
import ReviewPage from "@/pages/Broker/ReviewPage";
import UserTypeSelectionPage from "@/pages/UserTypeSelectionPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  // 인증 페이지들
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/user-type-selection",
    element: <UserTypeSelectionPage />,
  },
  // 판매자 페이지들
  {
    path: "/seller/products",
    element: <ProductsSellerPage />,
  },
  {
    path: "/seller/products/:id",
    element: <ProductDetailPage />,
  },
  {
    path: "/seller/products/register",
    element: <ProductRegistrationPage />,
  },
  // 구매자 페이지들
  {
    path: "/buyer/products",
    element: <ProductsBuyerPage />,
  },
  // 브로커 페이지들
  {
    path: "/broker/requests",
    element: <RequestListPage />,
  },
  {
    path: "/broker/review/:id",
    element: <ReviewPage />,
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}