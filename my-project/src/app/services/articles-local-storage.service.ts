import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { NewPost, Post } from '../dto/post';
import { ArticlesServiceInterface } from './articles-service.interface';
import { ArticlesPageResult } from './types/articles-page-result';

const POSTS_KEY = 'posts';
const ACTIVE_PAGE_KEY = 'activePage';
const PAGE_SIZE = 7;
const DEFAULT_POSTS: Post[] = [
  { id: '1', title: 'Первая статья Первая статья', text: 'Текст 1', categoryName: 'Общее' },
  { id: '2', title: 'Вторая статья Вторая статья', text: 'Текст 2', categoryName: 'Общее' },
];

@Injectable()
export class ArticlesLocalStorageService implements ArticlesServiceInterface {
  public getPosts(page: number): Observable<ArticlesPageResult> {
    const normalizedPage = this.normalizePage(page);
    const posts = this.getAllPosts();
    const result = this.buildPageResult(posts, normalizedPage);
    this.saveActivePage(result.activePage);

    return of(result);
  }

  public getTotalCount(): Observable<number> {
    return of(this.getAllPosts().length);
  }

  public getStoredActivePage(): number {
    const page = Number(localStorage.getItem(ACTIVE_PAGE_KEY) ?? '1');
    return this.normalizePage(page);
  }

  public addPost(post: NewPost, page: number): Observable<ArticlesPageResult> {
    return from(this.readImageDataUrl(post.imageFile)).pipe(
      map((imageUrl) => {
        const posts = this.getAllPosts();
        const newPost: Post = {
          id: crypto.randomUUID(),
          title: post.title,
          text: post.text,
          categoryName: post.categoryName.trim(),
          imageUrl,
        };

        const updatedPosts = [newPost, ...posts];
        this.savePosts(updatedPosts);

        const result = this.buildPageResult(updatedPosts, this.normalizePage(page));
        this.saveActivePage(result.activePage);
        return result;
      }),
    );
  }

  public updatePost(id: string, post: NewPost, page: number): Observable<ArticlesPageResult> {
    return from(this.readImageDataUrl(post.imageFile)).pipe(
      map((imageUrl) => {
        const posts = this.getAllPosts();
        const updatedPosts = posts.map((currentPost) => {
          if (currentPost.id !== id) {
            return currentPost;
          }
          return {
            ...currentPost,
            title: post.title,
            text: post.text,
            categoryName: post.categoryName.trim(),
            imageUrl: imageUrl ?? currentPost.imageUrl ?? null,
          };
        });

        this.savePosts(updatedPosts);

        const result = this.buildPageResult(updatedPosts, this.normalizePage(page));
        this.saveActivePage(result.activePage);
        return result;
      }),
    );
  }

  public deletePost(id: string, page: number): Observable<ArticlesPageResult> {
    const posts = this.getAllPosts();
    const updatedPosts = posts.filter((post) => post.id !== id);

    this.savePosts(updatedPosts);

    const totalPages = Math.max(1, Math.ceil(updatedPosts.length / PAGE_SIZE));
    const normalizedPage = Math.min(this.normalizePage(page), totalPages);
    const result = this.buildPageResult(updatedPosts, normalizedPage);
    this.saveActivePage(result.activePage);
    return of(result);
  }

  public getCategorySuggestions(): string[] {
    const names = this.getAllPosts()
      .map((p) => p.categoryName?.trim())
      .filter((n): n is string => Boolean(n));
    return [...new Set(names)].sort((a, b) => a.localeCompare(b, 'ru'));
  }

  private async readImageDataUrl(file: File | null | undefined): Promise<string | null> {
    if (!file) {
      return null;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  private getAllPosts(): Post[] {
    const rawPosts = localStorage.getItem(POSTS_KEY);

    if (!rawPosts) {
      this.savePosts(DEFAULT_POSTS);
      return DEFAULT_POSTS;
    }

    try {
      const parsed = JSON.parse(rawPosts) as unknown;
      if (!Array.isArray(parsed)) {
        this.savePosts(DEFAULT_POSTS);
        return DEFAULT_POSTS;
      }
      const posts = parsed.map((item) => this.coercePost(item)).filter((p): p is Post => p !== null);
      if (posts.length === 0) {
        this.savePosts(DEFAULT_POSTS);
        return DEFAULT_POSTS;
      }
      this.savePosts(posts);
      return posts;
    } catch {
      this.savePosts(DEFAULT_POSTS);
      return DEFAULT_POSTS;
    }
  }

  private coercePost(item: unknown): Post | null {
    if (!item || typeof item !== 'object') {
      return null;
    }

    const record = item as Record<string, unknown>;
    const id = record['id'] != null ? String(record['id']) : '';
    const title = String(record['title'] ?? '');
    const text = String(record['text'] ?? '');
    if (!id || !title) {
      return null;
    }

    return {
      id,
      title,
      text,
      imageUrl: record['imageUrl'] != null ? String(record['imageUrl']) : null,
      categoryId: record['categoryId'] != null ? String(record['categoryId']) : undefined,
      categoryName:
        record['categoryName'] != null ? String(record['categoryName']) : undefined,
      rating: typeof record['rating'] === 'number' ? record['rating'] : undefined,
    };
  }

  private savePosts(posts: Post[]): void {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }

  private saveActivePage(page: number): void {
    localStorage.setItem(ACTIVE_PAGE_KEY, String(page));
  }

  private buildPageResult(posts: Post[], page: number): ArticlesPageResult {
    const totalCount = posts.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const activePage = Math.min(Math.max(1, page), totalPages);
    const start = (activePage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    return {
      posts: posts.slice(start, end),
      totalCount,
      totalPages,
      activePage,
    };
  }

  private normalizePage(page: number): number {
    if (!Number.isFinite(page) || page < 1) {
      return 1;
    }

    return Math.floor(page);
  }
}
