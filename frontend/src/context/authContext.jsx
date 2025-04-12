import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useSocket } from './socketContext';
import moment from 'moment-timezone';

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
              emitLoginEvent(response.data.user);
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
      // Cleanup function to avoid memory leaks
      return () => {
          if (socket) {
              socket.off('login');
          }
      };
    },[]);
    const emitLoginEvent = (user) => {
        if (socket && user) {
            const nepaliTime = moment().tz('Asia/Kathmandu').toDate();
            socket.emit('login', {
                employeeName: user.name,
                loginTime: nepaliTime,
                role: user.role,
            });
        }
    };
    const emitLogoutEvent = (user) => {
        if (socket && user) {
            const nepaliTime = moment().tz('Asia/Kathmandu').toDate(); // Convert to Nepali time
            socket.emit('logout', {
                employeeName: user.name,
                logoutTime: nepaliTime,
                role: user.role,
            });
        }
    };
    const login = (user) =>{
        setUser(user);
        emitLoginEvent(user);
    }
    const logout = () => {
      if (socket && user) {
        emitLogoutEvent(user);
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