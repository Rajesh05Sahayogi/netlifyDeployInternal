import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MainNavbar from '../components/MainNavbar';
import { Outlet } from 'react-router-dom';

export default function Home() {
  // State to hold the user information
  const [user, setUser] = useState(() => {
    // Parse the user data from localStorage
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // useEffect to monitor login status changes in localStorage and update state
  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser)); // Parse and update user state
      } else {
        setUser(null); // No user, reset state
      }
    };

    // Call checkUser on initial render
    checkUser();

    // Optionally, listen for manual changes in localStorage (such as from another tab)
    window.addEventListener("storage", checkUser);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  return (
    <>
      {user ? (
        <div>
          <MainNavbar />
        </div>
      ) : (
        <div>
          <Header />
        </div>
      )}
      <div>
        <Outlet />
      </div>
    </>
  );
}
