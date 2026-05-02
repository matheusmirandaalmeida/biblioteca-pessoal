import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loading from '../components/common/Loading'

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loadingAuth } = useAuth()

    if (loadingAuth) {
        return <Loading text="Verificando sessão..." fullScreen />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}