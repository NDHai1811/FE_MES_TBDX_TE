import React from 'react';
import { useAuth } from './AuthContext';
import { useProfile } from './hooks/UserHooks';

const PermissionGuard = ({ children, permission }) => {
  const { userProfile } = useProfile();

  if (!userProfile || !userProfile.permissions.includes(permission)) {
    return null;
  }

  return <>{children}</>;
};

export default PermissionGuard;
