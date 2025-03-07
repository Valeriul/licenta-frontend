import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from '../pages/home/Home';
import Sign from '../pages/sign/Sign';
import VerifyUser from '../pages/verify_user/VerifyUser';
import Page404 from '../pages/404/404';
import ControlPanel from '../pages/control_panel/ControlPanel';

function RequiredParamVerifyLogin({ children }) {
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const paramS = searchParams.get('s');

  useEffect(() => {
    if (!paramS) {
      setIsVerified(false);
      return;
    }

    fetch(process.env.REACT_APP_API_URL + `/User/isVerified?salt=${paramS}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setIsVerified(data);
      })
      .catch(() => setIsVerified(false));
  }, [paramS]);


  if (!paramS || isVerified) {
    return <Navigate to="/404" replace />;
  }

  return React.cloneElement(children, { salt: paramS });
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
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default AppRoutes;
