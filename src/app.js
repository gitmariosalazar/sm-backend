import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import SearchGit from './routes/github.routes.js';
import {FRONTEND_URL} from './config.js';
import {swaggerSpec, swaggerUi} from './swaggerConfig.js';
import swaggerJSDoc from 'swagger-jsdoc';
import {SwaggerUIBundle, SwaggerUIStandalonePreset} from 'swagger-ui-dist';
import {updateExpiredTokensMiddleware} from './middlewares/updatetokens.js';

const app = express();

// Middleware setup
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
updateExpiredTokensMiddleware()

app.use(cors({
    credentials: true,
    origin: [FRONTEND_URL, "https://jf36d5k0-4000.use2.devtunnels.ms", "http://localhost:5173", "https://blog-mario-salazar.netlify.app", "https://blog-mario-salazar-bq3gujeoi-mario-salazars-projects.vercel.app", "https://www.mssalazar.com", 'https://blog-mario-salazar.vercel.app', "https://frontend-grapqh-project.vercel.app"],
}));


// Static files and routes
app.use(express.static(path.join(process.cwd(), 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.use('/search', SearchGit);

app.use('/api/docs', swaggerUi.serve, (req, res, next) => {
    const domain = `https://${req.get('host')}`;
    swaggerSpec.servers[0].url = domain;
    swaggerUi.setup(swaggerSpec, {
        customCssUrl: 'https://mariosalazar-styles-swagger-ui.vercel.app/css/swagger-ui.css'
    })(req, res, next);
});
app.get('/', async (req, res) => {
    const domain = `https://${req.get('host')}/api/docs`;
    res.render('index', {domain: domain});
});

// Production setup
if (process.env.NODE_ENV === 'production') {
    (async () => {
        const path = await import('path');
        app.use(express.static('client/dist'));

        app.get('*', (req, res) => {
            res.sendFile(path.resolve('client', 'dist', 'index.html'));
        });
    })();
}

// Error handling
app.use((err, req, res, next) => {
    res.status(500).send('Something broke!');
});

export default app;
