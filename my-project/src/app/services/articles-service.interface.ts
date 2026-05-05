import { Observable } from 'rxjs';
import { NewPost } from '../dto/post';
import { ArticlesPageResult } from './types/articles-page-result';

export interface ArticlesServiceInterface {
  getPosts(page: number): Observable<ArticlesPageResult>;
  getTotalCount(): Observable<number>;
  getStoredActivePage(): number;
  addPost(post: NewPost, page: number): Observable<ArticlesPageResult>;
  updatePost(id: number, post: NewPost, page: number): Observable<ArticlesPageResult>;
  deletePost(id: number, page: number): Observable<ArticlesPageResult>;
}
