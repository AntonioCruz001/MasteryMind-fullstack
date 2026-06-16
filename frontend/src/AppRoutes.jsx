import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"


import Layout from "./components/Layout";
import Subjects from "./pages/Subjects";
import Home from "./pages/Home";
import Review from "./pages/Review";
import Login from "./pages/Login";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="subjects" element={<Subjects />} />
                <Route path="review" element={<Review />} />
            </Route>

            <Route path="/login" element={<Login />} />
        </Routes>
    )
}
