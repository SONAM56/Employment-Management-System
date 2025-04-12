import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useSocket } from './socketContext';

const userContext = createContext();

const authContext = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();
    useEffect(() => {
      const verifyUser = async () => {
        try {
          const token = localStorage.getItem('token')
          if(token){
            const response = await axios.get('http://localhost:5000/api/auth/verify', 
              {
                headers :{
                  "Authorization": `Bearer ${token}`
                },
              }
            );
            console.log(response)
            if(response.data.success){
              setUser(response.data.user);
              if (socket) {
                socket.emit('login', { employeeName: response.data.user.name, loginTime: new Date(), role: response.data.user.role });
              }
            }
          }else {      
            setUser(null);
            setLoading(false);
          }
        } catch(error){
          console.log(error)
          if(error.response && !error.response.data.error) {
            setUser(null)
          }
        } finally{
          setLoading(false);
        }
      }
      verifyUser()
    },[socket]);
    const login = (user) =>{
        setUser(user);
        if (socket) {
          socket.emit('login', { employeeName: user.name, loginTime: new Date(), role: user.role });
        }
    }
    const logout = () => {
      if (socket && user) {
        socket.emit('logout', { employeeName: user.name, logoutTime: new Date(), role: user.role });
      }
      setUser(null);
      localStorage.removeItem("token");
    };
  return (
    <userContext.Provider value={{user, login, logout, loading}}>
        {children}
    </userContext.Provider>
  )
}

export const useAuth = () => useContext(userContext)
export default authContext