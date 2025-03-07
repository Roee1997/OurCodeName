import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user } = useAuth();
  console.log('משתמש ב- ProtectedRoute:', user);  // הוספת console.log לבדוק את הערך

  if (user === undefined) {
    // אם המשתמש עדיין לא טען, זה אומר שאנחנו מחכים לטעינה, אז נחזור או משהו אחר
    return <p>אנא המתן...</p>;
  }

  return user ? <Outlet /> : <Navigate to="/home" />;
};

export default ProtectedRoute;