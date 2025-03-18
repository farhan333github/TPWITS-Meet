// import React from "react";
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import LoginForm from "./Components/Login/Login";
// import Registerationform from "./Components/Register/Registerationform";
// import Meeting from "./Components/Dashboard/Meeting";
// import {AuthContext} from "./Context/AuthContext";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginForm />} />
//         <Route path="/login" element={<LoginForm />} />
//         <Route path="/register" element={<Registerationform />} />
//         <Route path="/Meeting" element={<Meeting />} />
//         <Route path="*" element={<Navigate to="/login" />} />
        
//       </Routes>
//     </Router>
//   );
// }

// export default App;






// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Register from "./Components/Register/Registerationform";
// import Navbar from "./Components/Navbar/Navbar";
// import Notifications from "./Components/Notifications/Notification";
// import Login from "./Components/Login/Login";
// import Meeting from "./Components/Dashboard/Meeting";
// import { AuthProvider } from "./Context/AuthContext";
// import PrivateRoute from "./Routes/PrivateRoutes";

// function App() {
//     return (
//         <AuthProvider>
//             <Router>
//                 <Navbar />
//                 <Routes>
//                     {/* Redirect root path to login */}
//                     <Route path="/" element={<Navigate to="/login" />} />

//                     <Route path="/register" element={<Register />} />
//                     <Route path="/login" element={<Login />} />

//                     {/* Private routes require authentication */}
//                     <Route path="/meeting" element={<PrivateRoute><Meeting /></PrivateRoute>} />
//                     <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
//                 </Routes>
//             </Router>
//         </AuthProvider>
//     );
// }

// export default App;
    







// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Register from "./Components/Register/Registerationform";
// import Login from "./Components/Login/Login";
// import Meeting from "./Components/Dashboard/Meeting";
// import { AuthProvider } from "./Context/AuthContext";
// import PrivateRoute from "./Routes/PrivateRoutes";

// function App() {
//     return (
//         <AuthProvider>
//             <Router>
//                 <Routes>
//                     {/* ✅ Redirect root path ("/") to login */}
//                     <Route path="/" element={<Navigate to="/login" />} />

//                     <Route path="/register" element={<Register />} />
//                     <Route path="/login" element={<Login />} />
//                     <Route path="/meeting" element={<PrivateRoute><Meeting /></PrivateRoute>} />
//                 </Routes>
//             </Router>
//         </AuthProvider>
//     );
// }

// export default App;








// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Register from "./Components/Register/Registerationform";
// import Login from "./Components/Login/Login";
// import Meeting from "./Components/Dashboard/Meeting";
// import Notifications from "./Components/Notifications/Notification"; 
// import { AuthProvider } from "./Context/AuthContext";
// import PrivateRoute from "./Routes/PrivateRoutes";
// import Navbar from "./Components/Navbar/Navbar"

// function App() {
//     return (
//         <AuthProvider>
               
//             <Router>
//             <Navbar />    
//                 <Routes>
                    
//                     <Route path="/" element={<Navigate to="/login" />} />

                    
//                     <Route path="/register" element={<Register />} />
//                     <Route path="/login" element={<Login />} />

                    
//                     <Route path="/meeting" element={<PrivateRoute><Meeting /></PrivateRoute>} />
//                     <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
//                 </Routes>
//             </Router>
//         </AuthProvider>
//     );
// }

// export default App;







import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Register from "./Components/Register/Registerationform";
import Login from "./Components/Login/Login";
import Meeting from "./Components/Dashboard/Meeting";
import Notifications from "./Components/Notifications/Notification"; 
import { AuthProvider } from "./Context/AuthContext";
import PrivateRoute from "./Routes/PrivateRoutes";
import Navbar from "./Components/Navbar/Navbar";

function App() {
    return (
        <AuthProvider>
            <Router>
                <ConditionalNavbar />  {/* Conditionally Render Navbar */}
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/meeting" element={<PrivateRoute><Meeting /></PrivateRoute>} />
                    <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

// ✅ Conditionally Render Navbar
const ConditionalNavbar = () => {
    const location = useLocation();
    
    // Hide Navbar on login & register pages
    if (location.pathname === "/login" || location.pathname === "/register") {
        return null;
    }
    
    return <Navbar />;
};

export default App;