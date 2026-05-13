import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import App from '../App';

import { AuthProvider } from '../contexts/AuthContext.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('App', () => {
    it('Renderiza o App com rotas', () => {
        render(
            <AuthProvider>
                <App />
            </AuthProvider>
        );
    });
});
