//Reusable API client
import {request} from '@playwright/test'

export async function apiRequest(method, endpoint, data={}) {
    const context = await request.newContext();
    return context[method](`${process.env.BASE_URL}${endpoint}`,{
        data
    });
}
