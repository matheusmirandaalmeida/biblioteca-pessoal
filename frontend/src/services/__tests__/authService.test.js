import { describe, it, expect, beforeEach } from 'vitest';
import authService from '../authService';
import { server } from '../../test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('authService', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('login() com credenciais válidas', async () => {
        const response = await authService.login({ email: 'test@example.com', senha: 'password123' });
        expect(response.token).toBe('mock-jwt-token');
    });

    describe('login() com credenciais inválidas', () => {
        const scenarios = [
            { email: '', senha: 'password123' },
            { email: 'test@example.com', senha: '' },
            { email: 'invalid', senha: '123' },
            { email: '', senha: '' }
        ];

        scenarios.forEach((credentials) => {
            it(`deve falhar com credenciais: ${JSON.stringify(credentials)}`, async () => {
                await expect(authService.login(credentials)).rejects.toThrow();
            });
        });
    });

    it('register() com dados válidos', async () => {
        const response = await authService.register({ nome: 'Novo', email: 'novo@example.com', senha: '123' });
        expect(response.id).toBe(2);
        expect(response.email).toBe('novo@example.com');
    });

    it('register() com email duplicado', async () => {
        await expect(authService.register({ nome: 'Dup', email: 'duplicate@example.com', senha: '123' })).rejects.toThrow();
    });

    describe('register() com dados inválidos', () => {
        const scenarios = [
            { nome: '', email: 'novo@example.com', senha: '123' },
            { nome: 'Novo', email: '', senha: '123' },
            { nome: 'Novo', email: 'novo@example.com', senha: '' }
        ];

        scenarios.forEach((payload) => {
            it(`deve falhar com payload: ${JSON.stringify(payload)}`, async () => {
                // MSW needs to handle these as errors if we want strict rejection.
                // For now, if the API throws 400, it rejects.
                server.use(
                    http.post('http://localhost:8080/auth/register', () => {
                        return HttpResponse.json({ message: 'Bad request' }, { status: 400 });
                    })
                );
                await expect(authService.register(payload)).rejects.toThrow();
            });
        });
    });

    it('getMe() com token válido', async () => {
        localStorage.setItem('token', 'mock-jwt-token');
        const user = await authService.getMe();
        expect(user.id).toBe(1);
        expect(user.email).toBe('test@example.com');
    });

    it('getMe() sem token', async () => {
        await expect(authService.getMe()).rejects.toThrow();
    });

    it('getMe() com token expirado', async () => {
        localStorage.setItem('token', 'expired-token');
        await expect(authService.getMe()).rejects.toThrow();
    });
});
