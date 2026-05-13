import { http, HttpResponse } from 'msw';

const BASE_URL = 'http://localhost:8080';
const url = (path) => `${BASE_URL}${path}`;

export const handlers = [
  // Auth Handlers
  http.post(url('/auth/login'), async ({ request }) => {
    const body = await request.json();
    if (body.email === 'test@example.com' && body.senha === 'password123') {
      return HttpResponse.json({ token: 'mock-jwt-token' });
    }
    return HttpResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
  }),

  http.post(url('/auth/register'), async ({ request }) => {
    const body = await request.json();
    if (body.email === 'duplicate@example.com') {
      return HttpResponse.json({ message: 'Email já cadastrado' }, { status: 409 });
    }
    return HttpResponse.json({ id: 2, nome: body.nome, email: body.email }, { status: 201 });
  }),

  http.post(url('/auth/logout'), () => {
    return HttpResponse.json({ message: 'Logout successful' });
  }),

  http.get(url('/auth/me'), ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (authHeader === 'Bearer mock-jwt-token') {
      return HttpResponse.json({ id: 1, nome: 'Test User', email: 'test@example.com' });
    }
    return HttpResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }),

  // Books Handlers
  http.get(url('/api/books'), ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }
    return HttpResponse.json([
      { id: '1', titulo: 'Livro 1', autor: 'Autor 1', statusLeitura: 'LIDO' }
    ]);
  }),

  http.get(url('/api/books/external-search'), ({ request }) => {
    const urlObj = new URL(request.url, 'http://localhost');
    const query = urlObj.searchParams.get('query');
    if (query === 'notfound') {
      return HttpResponse.json([]);
    }
    return HttpResponse.json([
      { titulo: 'External Book', autor: 'External Author', isbn: '123456' }
    ]);
  }),

  http.get(url('/api/books/:id'), ({ params }) => {
    if (params.id === '1') {
      return HttpResponse.json({ id: '1', titulo: 'Livro 1', autor: 'Autor 1', statusLeitura: 'LIDO' });
    }
    return HttpResponse.json({ message: 'Livro não encontrado' }, { status: 404 });
  }),

  http.post(url('/api/books'), async ({ request }) => {
    const body = await request.json();
    if (!body.titulo || !body.autor) {
      return HttpResponse.json({ message: 'Campos obrigatórios ausentes' }, { status: 400 });
    }
    return HttpResponse.json({ id: '2', ...body }, { status: 201 });
  }),

  http.put(url('/api/books/:id'), async ({ params, request }) => {
    const body = await request.json();
    if (params.id === '1') {
      return HttpResponse.json({ id: '1', ...body });
    }
    return HttpResponse.json({ message: 'Livro não encontrado' }, { status: 404 });
  }),

  http.delete(url('/api/books/:id'), ({ params }) => {
    if (params.id === '1') {
      return HttpResponse.json({ message: 'Livro deletado' }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Livro não encontrado' }, { status: 404 });
  })
];
