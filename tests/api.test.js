const {test, expect} = require('@playwright/test');

test.describe('API Tests', ()=>{

    test('GET /post should return a list of posts', async ({request})=>{
        const response = await request.get('/posts');
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.length).toBeGreaterThan(0);
    });

    test('POST /posts should create a new post', async({request})=>{
        const newPost = {
            title: 'My test post',
            body: 'This is a test post',
            userId: 1,
        };

        const response = await request.post('/posts', {data: newPost});
        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.title).toBe(newPost.title);
    });

});

