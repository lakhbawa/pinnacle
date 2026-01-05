export interface Outcome {
    id: string;
    title: string;
    position: string;
    createdAt: string;
    updatedAt: string;
    drivers: Driver[];
}

export type Driver = {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    outcome?: Outcome;
    actions: Action[];
}

export type Action = {
    id: string;
    title: string;
    user_id: string;
    outcome_id: string;
    driver_id: string;
    outcome: Outcome;
    driver: Driver;
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