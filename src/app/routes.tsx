// src/app/routes.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import SearchPage from "@/pages/SearchPage/SearchPage";   // 검색 페이지
import ChatPage from "@/pages/ChatPage/ChatPage";       // Q&A 챗봇 페이지
import DashboardPage from "@/pages/DashboardPage/DashboardPage"; // 대시보드 페이지
import DocumentPage from "@/pages/DocumentPage/DocumentPage";   // 문서 상세 페이지
import HomePage from "@/pages/HomePage/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "chat",
        element: <ChatPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "document",
        element: <DocumentPage />,
      },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}