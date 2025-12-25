export interface Issue {
    id: string;
    title: string;
    issueType: string;
    dueDate: string | null;
    listId: string;
    position: string;
    createdAt: string;
    updatedAt: string;
}

export interface List {
    id: string;
    title: string;
    projectId: string;
    position: string;
    createdAt: string;
    updatedAt: string;
    issues: Issue[];
}

export interface Project {
    id: string;
    title: string;
    position: string;
    createdAt: string;
    updatedAt: string;
    lists: List[];
}