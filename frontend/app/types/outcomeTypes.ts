
export interface Outcome {
    id: string;
    title: string;
    position: string;
    createdAt: string;
    updatedAt: string;
    drivers: Driver[];
    why_it_matters: string,
    deadline: string,
    status: string,
    created_at: string,
    completed_at: string,
    archived_at: string,
    success_metrics?: SuccessMetric[];
}

export type Driver = {
    id: string;
    title: string;
    description: string;
    position: string;
    outcome_id: string;
    createdAt: string;
    updatedAt: string;
    outcome?: Outcome;
    actions: Action[];
}

export type Action = {
    id: string;
    title: string;
    description: string;

    user_id: string;
    outcome_id: string;
    driver_id: string;
    is_completed: boolean;
    outcome: Outcome;
    driver: Driver;
    created_at: string;
    updated_at: string;
    scheduled_for: string;
    last_moved_outcome_at: string;
    completed_at: string;
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

export type DriverResponse = {
    success: boolean,
    data?: Driver
}

export type DriverListResponse = {
    success: boolean,
    data?: Driver[]
}

export type ActionResponse = {
    success: boolean,
    data?: Action
}

export type ActionListResponse = {
    success: boolean,
    data?: Action[]
}

export type OutcomeResponse = {
    success: boolean,
    data?: Outcome
}

export type OutcomeListResponse = {
    success: boolean,
    data?: Outcome[]
}

export type SuccessMetric = {
    id: string;
    outcome_id: string;
    metric_name: string;
    target_value: number;
    current_value: number;
    unit: string;
    description?: string;
    created_at: string;
    updated_at: string;
    outcome?: Outcome;
}

export type SuccessMetricResponse = {
    success: boolean;
    data?: SuccessMetric;
}

export type SuccessMetricListResponse = {
    success: boolean;
    data?: SuccessMetric[];
}

export type Initiative = Driver;
export type InitiativeResponse = DriverResponse;
export type InitiativeListResponse = DriverListResponse;