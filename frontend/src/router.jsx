import { createBrowserRouter, RouterProvider } from "@tanstack/react-router";
import AuthPage from "./pages/AuthPage.jsx";
import App from "./App.jsx";

// Create a simple router for now
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
