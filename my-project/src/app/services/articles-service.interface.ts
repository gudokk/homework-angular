import { Observable } from 'rxjs';
import { NewPost } from '../dto/post';
import { ArticlesPageResult } from './types/articles-page-result';

export interface ArticlesServiceInterface {
  getPosts(page: number): Observable<ArticlesPageResult>;
  getTotalCount(): Observable<number>;
  getStoredActivePage(): number;
  addPost(post: NewPost, page: number): Observable<ArticlesPageResult>;
  updatePost(id: string, post: NewPost, page: number): Observable<ArticlesPageResult>;
  deletePost(id: string, page: number): Observable<ArticlesPageResult>;
  /** Подсказки для автокомплита категорий (localStorage — из статей; API — пусто, список с бэкенда отдельно) */
  getCategorySuggestions(): string[];
}
