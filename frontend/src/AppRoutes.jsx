import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"

import AuthLayout from "./layouts/AuthLayout"
import HomeLayout from "./layouts/HomeLayout";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

import Subjects from "./pages/Subjects";
import Review from "./pages/Review";
import Statistics from "./pages/Statistics";


export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login/>}/>
                <Route path="cadastro" element={<Cadastro/>}/>
            </Route>
            <Route path="/home" element={<HomeLayout/>}>
                <Route index element={<Subjects/>}/>
                <Route path="subjects" element={<Subjects/>}/>
                <Route path="review" element={<Review/>}/>
                <Route path="statistics" element={<Statistics/>}/>
            </Route>
        </Routes>
    )
}
