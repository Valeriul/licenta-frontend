import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import crypto from 'crypto-js';

const UserContext = createContext();
const SALT = '31251254213412'; 


export const useUser = () => useContext(UserContext);


const encryptData = (data) => {
  return crypto.AES.encrypt(JSON.stringify(data), SALT).toString();
};


const decryptData = (encryptedData) => {
  try {
    const bytes = crypto.AES.decrypt(encryptedData, SALT);
    return JSON.parse(bytes.toString(crypto.enc.Utf8));
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const storedUser = Cookies.get('user');
    if (storedUser) {
      const decryptedUser = decryptData(storedUser);
      setUser(decryptedUser);
    }
  }, []);

  
  const login = (userData) => {
    const encryptedUser = encryptData(userData);
    Cookies.set('user', encryptedUser, { expires: 7 }); 
    setUser(userData);
  };

  
  const logout = () => {
    Cookies.remove('user');
    setUser(null);
    
    return <Navigate to="/" />;
  };

  
  const getUserId = () => {
    const storedUser = Cookies.get('user');
    if (storedUser) {
      const decryptedUser = decryptData(storedUser);
      return decryptedUser?.id_user || null;
    }
    return null;
  };

  return (
    <UserContext.Provider value={{ user, login, logout, getUserId }}>
      {children}
    </UserContext.Provider>
  );
};
