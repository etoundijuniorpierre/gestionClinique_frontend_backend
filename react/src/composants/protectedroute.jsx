import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const bool  =  !!token

  return bool ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute
