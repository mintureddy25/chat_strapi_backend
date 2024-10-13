module.exports = () => ({
    io: {
        enabled: true,
        config: {
            contentTypes: ['api::message.message'],
            cors: {
                enabled:true,
                origin: [process.env.CORS_ORIGIN  || 'http://localhost:3000'],
                methods: ['GET', 'POST'], 
                credentials: true, 
            },
        },
    },
});
