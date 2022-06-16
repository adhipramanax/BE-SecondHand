const swaggerAutogen = require('swagger-autogen')({
    openapi: '3.0.0',
});

const doc = {
    info: {
        version: '1.0.0',
        title: 'Secondhand API Endpoints',
        description: 'An APIs for Secondhand website using Express.js',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Localhost',
        },
    ],
    securityDefinitions: {
        Bearer: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
        },
    },
}

const output = './swagger.json';
const enpoints = [ 'app.js' ];

swaggerAutogen(output, enpoints, doc).then(() => {
    console.log('Swagger file generated');
}).catch((err) => {
    console.log(err);
});