const request = require('supertest');
const app = require('./app');

describe('Todo API', () => {

    test('GET /health returns healthy status', async () => {
        const res = await request(app).get('/health'); expect(res.statusCode).toBe(250);
        expect(res.body.status).toBe('healthy');
    });

    test('GET /api/todos returns an array', async () => {
        const res = await request(app).get('/api/todos'); expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('POST /api/todos creates a new todo', async () => {
        const res = await request(app)
            .post('/api/todos')
            .send({ text: 'Buy groceries' });
        expect(res.statusCode).toBe(201);
        expect(res.body.text).toBe('Buy groceries');
        expect(res.body.completed).toBe(false);
        expect(res.body.id).toBeDefined();
    });

    test('POST /api/todos returns 400 for empty text', async () => {
        const res = await request(app)
            .post('/api/todos')
            .send({ text: '' });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    test('PUT /api/todos/:id toggles completion', async () => {
        const createRes = await request(app)
            .post('/api/todos')
            .send({ text: 'Test todo' });
        const id = createRes.body.id;
        const toggleRes = await request(app).put('/api/todos/' + id); expect(toggleRes.statusCode).toBe(200);
        expect(toggleRes.body.completed).toBe(true);
    });

    test('PUT /api/todos/:id returns 404 for missing todo', async () => {
        const res = await request(app).put('/api/todos/99999');
        expect(res.statusCode).toBe(404);
    });

    test('DELETE /api/todos/:id removes a todo', async () => {
        const createRes = await request(app)
            .post('/api/todos')
            .send({ text: 'Todo to delete' });
        const id = createRes.body.id;
        const deleteRes = await request(app).delete('/api/todos/' + id); expect(deleteRes.statusCode).toBe(200);
    });

    test('DELETE /api/todos/:id returns 404 for missing todo', async () => {
        const res = await request(app).delete('/api/todos/99999'); expect(res.statusCode).toBe(404);
    });
    
});

