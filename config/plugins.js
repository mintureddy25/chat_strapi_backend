module.exports = () => ({
    io: {
        enabled: true,
        config: {
            contentTypes: ['api::message.message'],
            cors: {
                enabled:true,
                origin: ['http://localhost:3000'],
                methods: ['GET', 'POST'], 
                credentials: true, 
            },
        },
    },
});
