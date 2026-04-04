import React from "react";
import Login from "./Screens/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import mystore from "./redux/store";
import StudentHome from "./Screens/Student/HomeNew";
import FacultyHome from "./Screens/Faculty/HomeNew";
import AdminHome from "./Screens/Admin/HomeNew";
import ForgetPassword from "./Screens/ForgetPassword";
import UpdatePassword from "./Screens/UpdatePassword";
import Signup from "./Screens/Signup";

const App = () => {
  return (
    <>
      <Provider store={mystore}>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route
              path="/:type/update-password/:resetId"
              element={<UpdatePassword />}
            />
            <Route path="student" element={<StudentHome />} />
            <Route path="faculty" element={<FacultyHome />} />
            <Route path="admin" element={<AdminHome />} />
          </Routes>
        </Router>
      </Provider>
    </>
  );
};

export default App;

