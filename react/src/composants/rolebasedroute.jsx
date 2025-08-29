// components/RoleBasedRoute.js
import { Navigate, Outlet } from 'react-router-dom';

const RoleBasedRoute = ({ allowedRoles }) => {
  const userString = localStorage.getItem('user');
  
  if (!userString) {
    return <Navigate to="/" replace />;
  }

  let user;
  try {
    user = JSON.parse(userString);
  } catch (error) {
    console.error('RoleBasedRoute: Erreur lors du parsing du rôle utilisateur:', error);
    return <Navigate to="/" replace />;
  }

  const hasAccess = allowedRoles.includes(user);

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
