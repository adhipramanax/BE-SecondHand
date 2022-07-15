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
            url: 'http://localhost:8080/api/v1',
            description: 'Localhost',
        },
    ],
    securityDefinitions: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        },
    },
}

const output = './swagger.json';
const enpoints = [ 'routes/api/v1/index.js' ];

swaggerAutogen(output, enpoints, doc).then(() => {
    console.log('Swagger file generated');
}).catch((err) => {
    console.log(err);
});