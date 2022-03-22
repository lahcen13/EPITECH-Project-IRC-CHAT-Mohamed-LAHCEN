import React from "react";
import  { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import PageApplication from "./components/PageApplication/PageApplication";



//sessionStorage.getItem('token')
render(
  <BrowserRouter>
    <Routes>
      <Route path="/register" element={sessionStorage.getItem('token') ? <h1>Already connected !</h1> : <Register />}>
      </Route>
      <Route path="/login" element={sessionStorage.getItem('token') ? <h1>Already connected !</h1> : <Login />}>
      </Route>
      
      <Route path="/" element={sessionStorage.getItem('token') ? <PageApplication></PageApplication>: <Login /> }>
      </Route>


    </Routes>
  </BrowserRouter >,
  document.getElementById("root")
);
