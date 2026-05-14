import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ArticleApiDto, ArticlesListApiResponse, CategoryApiDto } from '../dto/article-api';
import { NewPost } from '../dto/post';
import { ArticleMapperService } from './article-mapper.service';
import { ArticlesServiceInterface } from './articles-service.interface';
import { ArticlesPageResult } from './types/articles-page-result';
import { CategoriesApiService } from './categories-api.service';

const PAGE_SIZE = 7;
const ACTIVE_PAGE_KEY = 'activePage';

@Injectable()
export class ArticlesApiService implements ArticlesServiceInterface {
  constructor(
    private readonly http: HttpClient,
    private readonly categoriesApi: CategoriesApiService,
    private readonly articleMapper: ArticleMapperService,
  ) {}

  public getPosts(page: number): Observable<ArticlesPageResult> {
    const normalizedPage = this.normalizePage(page);
    return this.loadListWithCategories(normalizedPage).pipe(
      tap((result) => this.saveActivePage(result.activePage)),
    );
  }

  public getTotalCount(): Observable<number> {
    return this.http
      .get<ArticlesListApiResponse>('/api/articles', {
        params: { page: '1', limit: '1' },
      })
      .pipe(map((response) => response.total));
  }

  public getStoredActivePage(): number {
    const page = Number(localStorage.getItem(ACTIVE_PAGE_KEY) ?? '1');
    return this.normalizePage(page);
  }

  public getCategorySuggestions(): string[] {
    return [];
  }

  public addPost(post: NewPost, page: number): Observable<ArticlesPageResult> {
    return this.resolveCategoryId(post.categoryName).pipe(
      switchMap((categoryId) => this.createArticle(post, categoryId)),
      switchMap(() => this.getPosts(page)),
    );
  }

  public updatePost(id: string, post: NewPost, page: number): Observable<ArticlesPageResult> {
    return this.resolveCategoryId(post.categoryName).pipe(
      switchMap((categoryId) => this.patchArticle(id, post, categoryId)),
      switchMap(() => this.getPosts(page)),
    );
  }

  public deletePost(id: string, page: number): Observable<ArticlesPageResult> {
    return this.http.delete(`/api/articles/${id}`).pipe(switchMap(() => this.getPosts(page)));
  }

  private loadListWithCategories(page: number): Observable<ArticlesPageResult> {
    return forkJoin({
      categories: this.categoriesApi.getAll(),
      list: this.http.get<ArticlesListApiResponse>('/api/articles', {
        params: { page: String(page), limit: String(PAGE_SIZE) },
      }),
    }).pipe(
      switchMap(({ categories, list }) => {
        const totalPages = Math.max(1, Math.ceil(list.total / list.limit));
        if (list.total > 0 && list.items.length === 0 && page > totalPages) {
          return forkJoin({
            categories: of(categories),
            list: this.http.get<ArticlesListApiResponse>('/api/articles', {
              params: { page: String(totalPages), limit: String(PAGE_SIZE) },
            }),
          });
        }
        return of({ categories, list });
      }),
      map(({ categories, list }) => this.toPageResult(list, categories)),
    );
  }

  private toPageResult(list: ArticlesListApiResponse, categories: CategoryApiDto[]): ArticlesPageResult {
    const categoryNames = new Map(categories.map((c) => [c.id, c.name]));
    const posts = list.items.map((item) =>
      this.articleMapper.articleToPost(item, categoryNames.get(item.categoryId)),
    );
    const totalPages = Math.max(1, Math.ceil(list.total / list.limit));
    const activePage = Math.min(Math.max(1, list.page), totalPages);

    return {
      posts,
      totalCount: list.total,
      totalPages,
      activePage,
    };
  }

  private resolveCategoryId(categoryName: string): Observable<string> {
    const name = categoryName.trim();
    return this.categoriesApi.getAll().pipe(
      switchMap((categories) => {
        const existing = this.categoriesApi.findIdByName(categories, name);
        if (existing) {
          return of(existing);
        }
        return this.categoriesApi.create(name).pipe(map((created) => created.id));
      }),
    );
  }

  private createArticle(post: NewPost, categoryId: string): Observable<ArticleApiDto> {
    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('content', post.text);
    formData.append('categoryId', categoryId);
    if (post.imageFile) {
      formData.append('image', post.imageFile, post.imageFile.name);
    }
    return this.http.post<ArticleApiDto>('/api/articles', formData);
  }

  private patchArticle(id: string, post: NewPost, categoryId: string): Observable<ArticleApiDto> {
    if (post.imageFile) {
      const formData = new FormData();
      formData.append('title', post.title);
      formData.append('content', post.text);
      formData.append('categoryId', categoryId);
      formData.append('image', post.imageFile, post.imageFile.name);
      return this.http.patch<ArticleApiDto>(`/api/articles/${id}`, formData);
    }

    return this.http.patch<ArticleApiDto>(`/api/articles/${id}`, {
      title: post.title,
      content: post.text,
      categoryId,
    });
  }

  private saveActivePage(page: number): void {
    localStorage.setItem(ACTIVE_PAGE_KEY, String(page));
  }

  private normalizePage(page: number): number {
    if (!Number.isFinite(page) || page < 1) {
      return 1;
    }
    return Math.floor(page);
  }
}
