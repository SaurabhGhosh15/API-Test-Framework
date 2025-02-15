import { defineConfig } from "@playwright/test";
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
   // reporter:[['html',{open:'never'}], ['allure-playwright']],
    use: {
        baseURL: process.env.BASE_URL,
        extraHTTPHeaders: {
            'Content-Type': 'application/json',
        },
    },
});