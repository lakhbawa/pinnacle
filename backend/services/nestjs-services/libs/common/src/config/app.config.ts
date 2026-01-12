// app.config.ts
export default () => ({
    app: {
        jwt: {
            secret: process.env.SECRET_KEY || 'development-secret-change-in-production',
            expiresIn: process.env.EXPIRES_IN || 300,
        },
        app_name: process.env.APP_NAME,
    },
    kafka: {
        consumer_groups: {
            'outcomes_service': '',
            'notifications_service': '',
            'authentication_service': '',
            'users_service': '',
        }
    },
    sample_data: {
        users: {
            test_user : {
                id: 'ff74c58d-e0b4-4cb1-85dc-660c21ea001a',
            },
            admin : {
                id: '28a81140-ab93-45b9-b233-87ed8871ef5f',
            }
        }
    }
})