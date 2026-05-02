import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import DashboardPage from '../pages/auth/dashboard/DashboardPage'
import BooksPage from '../pages/auth/books/BooksPage'
import CreateBookPage from '../pages/auth/books/CreateBookPage'
import EditBookPage from '../pages/auth/books/EditBookPage'
import BookDetailsPage from '../pages/auth/books/BookDetailsPage'
import ProtectedRoute from './ProtectedRoute'
import MainLayout from '../components/common/layout/MainLayout'

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/cadastro" element={<RegisterPage />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="livros" element={<BooksPage />} />
                    <Route path="livros/novo" element={<CreateBookPage />} />
                    <Route path="livros/:id" element={<BookDetailsPage />} />
                    <Route path="livros/:id/editar" element={<EditBookPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}