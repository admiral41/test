import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Toaster } from 'react-hot-toast';
import FileDownload from "./pages/FileDownload";
import ApplicationLayout from "./pages/ApplicationLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";
import HomeLayout from "./pages/homeLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/app",
        element: <ApplicationLayout />,
        children: [
          { path: "/app", element: <ApplicationLayout /> },
          // { path: "/app/file-history", element: <FileHistory /> },
          // { path: "/app/user-profile", element: <UserProfilePage /> },
          // { path: "/app/user-dashboard", element: <UserDashboard /> },
        ],
      },
      {
        path: "/download",
        element: <FileDownload />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </>
  );
}

export default App;
