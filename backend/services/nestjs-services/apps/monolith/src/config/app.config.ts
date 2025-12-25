// app.config.ts
export default () => ({
    app: {
        jwt: {
            secret: process.env.SECRET_KEY || 'development-secret-change-in-production',
            expiresIn: process.env.EXPIRES_IN || 300,
        },
        app_name: process.env.APP_NAME,
    }
})