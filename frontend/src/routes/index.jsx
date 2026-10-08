import { Routes, Route, Navigate } from 'react-router-dom';

import AuthLayout from '../layouts/AuthLayout';
import HomeLayout from '../layouts/HomeLayout';

import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';

import Subjects from '../pages/Subjects';
import Flashcards from '../pages/Flashcards';
import Review from '../pages/Review';
import Statistics from '../pages/Statistics';

import { ProtectedRoute } from './ProtectedRoute';

import DevFlashcardHarness from '../components/flashcards/DevFlashcardHarness';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Rotas Públicas */}
            <Route element={<AuthLayout />}>
                <Route path='/' element={<LandingPage />} />
                <Route path='/login' element={<Login />} />
                <Route path='/cadastro' element={<Cadastro />} />
            </Route>

            {/* Rotas Protegidas */}
            <Route element={
                <ProtectedRoute>
                    <HomeLayout />
                </ProtectedRoute>
            }>
                <Route path='/home' element={<Navigate to={"/home/subjects"} replace />} />
                <Route path='/home/subjects' element={<Subjects />} />
                <Route path='/home/subjects/:subjectId/flashcards' element={<Flashcards />} />
                <Route path='/home/review' element={<Review />} />
                <Route path='/home/statistics' element={<Statistics />} />
            </Route>

            {/* Fallback de rota */}

            <Route path='*' element={<Navigate to={"/"} replace />} />

            {import.meta.env.DEV && 
            <Route path='dev/flashcards' element={<DevFlashcardHarness/>} />}
        </Routes>
    )
}