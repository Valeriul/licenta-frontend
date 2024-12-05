import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from '../pages/home/Home';
import Sign from '../pages/sign/Sign';
import VerifyUser from '../pages/verify_user/VerifyUser';
import Page404 from '../pages/404/404';
import ControlPanel from '../pages/control_panel/ControlPanel';

function RequiredParamVerifyLogin({ children }) {
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const paramS = searchParams.get('s');

  
  if (!paramS) {
    return <Navigate to="/404" replace />;
  }

  fetch(process.env.REACT_APP_API_URL +`/User/isVerified?salt=${paramS}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json())
    .then((data) => {
      setIsVerified(data);
    });

  if (!isVerified) {
    return React.cloneElement(children, { salt: paramS });
  } else {
    return <Navigate to="/404" replace />;
  }
}

function AppRoutes() {
  return (
    <Routes>
      {/* Home page route */}
      <Route path="/" element={<Home />} />

      {/* Registration and login routes */}
      <Route path="/register" element={<Sign />} />
      <Route path="/signup" element={<Navigate to="/register" replace />} />
      <Route path="/login" element={<Sign />} />
      <Route path="/signin" element={<Navigate to="/login" replace />} />
      <Route path="/control-panel" element={<ControlPanel />} />

      {/* Protected route with mandatory query parameter 's' */}
      <Route
        path="/verify-user"
        element={
          <RequiredParamVerifyLogin>
            <VerifyUser />
          </RequiredParamVerifyLogin>
        }
      />

      {/* 404 route for non-existing pages */}
      <Route path="/404" element={<Page404 />} />
    </Routes>
  );
}

export default AppRoutes;
