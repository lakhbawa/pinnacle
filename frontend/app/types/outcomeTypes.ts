export interface Outcome {
    id: string;
    title: string;
    position: string;
    createdAt: string;
    updatedAt: string;
}



export interface User {
    id: string,
    email: string,
    company: string,
    name: string,
    accessToken: string,
}

export type AuthResponse = {
    success: boolean,
    data: {
        user: User,
        token: string,
    }
}