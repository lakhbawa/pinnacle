export interface Issue {
    id: string;
    title: string;
    issueType: string;
    dueDate: string | null;
    listId: string;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface List {
    id: string;
    title: string;
    projectId: string;
    order: number;
    createdAt: string;
    updatedAt: string;
    issues: Issue[];
}

export interface Project {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    lists: List[];
}