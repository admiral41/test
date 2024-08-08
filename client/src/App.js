import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import FileDownload from './pages/FileDownload';
import ApplicationLayout from './pages/ApplicationLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import ApplicationPage from './pages/ApplicationPage';
import FileHistory from './pages/FileHistory';
import UserProfilePage from './pages/UserProfilePage';
import { AuthProvider } from './context/AuthContext';
import HomeLayout from './pages/homeLayout';
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/app',
        element: <ApplicationLayout />,
        children: [
          { path: '/app', element: <ApplicationPage /> },
          { path: '/app/file-history', element: <FileHistory /> },
          { path: '/app/user-profile', element: <UserProfilePage /> }
        ],
      },
      {
        path: '/download',
        element: <FileDownload />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </AuthProvider>
  );
}

export default App;
