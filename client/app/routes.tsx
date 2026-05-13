import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import { AuthSuccess } from "./pages/auth/AuthSuccess";
import DashboardHome from "./pages/dashboard/DashboardHome";
import MyPolls from "./pages/dashboard/MyPolls";
import CreatePoll from "./pages/dashboard/CreatePoll";
import EditPoll from "./pages/dashboard/EditPoll";
import PollDetails from "./pages/dashboard/PollDetails";
import SettingsPage from "./pages/dashboard/SettingsPage";
import PublicPoll from "./pages/public/PublicPoll";
import PublicResults from "./pages/public/PublicResults";
import Documentation from "./pages/Documentation";
import AboutPage from "./pages/AboutPage";
import LegalPage from "./pages/LegalPage";
import NotFound from "./pages/error/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      {
        path: "login",
        element: <AuthLayout />,
        children: [{ index: true, element: <Login /> }],
      },
      {
        path: "auth/success",
        element: <AuthSuccess />,
      },
      { path: "documentation", element: <Documentation /> },
      { path: "about", element: <AboutPage /> },
      { path: "terms", element: <LegalPage /> },
      { path: "privacy", element: <LegalPage /> },
      {
        path: "app",
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { index: true, element: <DashboardHome /> },
              { path: "polls", element: <MyPolls /> },
              { path: "polls/new", element: <CreatePoll /> },
              { path: "polls/:id/edit", element: <EditPoll /> },
              { path: "polls/:id", element: <PollDetails /> },
              { path: "settings", element: <SettingsPage /> },
            ],
          },
        ],
      },
      {
        path: "p/:id",
        element: <PublicPoll />,
      },
      {
        path: "p/:id/results",
        element: <PublicResults />,
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
