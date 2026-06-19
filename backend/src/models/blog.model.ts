export interface Blog {
    id?: number;
    title: string;
    content: string;
    author_id: number;
    author_name?: string;
    created_at?: Date;
    updated_at?: Date;
}