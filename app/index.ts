import { Elysia } from 'elysia';
import { opentelemetry } from '@elysiajs/opentelemetry';

const app = new Elysia()
    .use(opentelemetry())
    .get('/', () => ({
        message: 'Hello from Elysia with OpenTelemetry! 🚀',
        timestamp: new Date().toISOString(),
    }))
    .get('/health', () => ({
        status: 'healthy',
        uptime: process.uptime(),
    }))
    .get('/metrics-test', async () => {
        // สร้าง artificial load เพื่อทดสอบ metrics
        const start = Date.now();
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
        const duration = Date.now() - start;

        return {
            message: 'Metrics test endpoint',
            duration: `${duration}ms`,
            randomValue: Math.random(),
        };
    })
    .get('/slow', async () => {
        // Endpoint ที่ช้าเพื่อทดสอบ latency metrics
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { message: 'This was slow!' };
    })
    .get('/error', () => {
        // Endpoint สำหรับทดสอบ error metrics
        throw new Error('This is a test error!');
    })
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
console.log('📊 OpenTelemetry metrics are being exported');
console.log('');
console.log('Available endpoints:');
console.log('  GET / - Hello message');
console.log('  GET /health - Health check');
console.log('  GET /metrics-test - Generate random metrics');
console.log('  GET /slow - Slow endpoint (1s delay)');
console.log('  GET /error - Error endpoint');
