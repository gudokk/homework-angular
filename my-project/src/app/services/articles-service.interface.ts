import { Observable } from "rxjs";
import { Post, NewPost } from "../dto/post";

export interface ArticlesPageResult {
    posts: Post[];
    totalCount: number;
    totalPages: number;
    activePage: number;
}

export interface ArticlesServiceInterface {
    getPosts(page: number): Observable<ArticlesPageResult>;
    getTotalCount(): Observable<number>;
    addPost(post: NewPost, page: number): Observable<ArticlesPageResult>
    updatePost(id: number, post: NewPost, page: number): Observable<ArticlesPageResult>
    deletePost(id: number, page: number): Observable<ArticlesPageResult>
}
