import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Post, NewPost } from '../dto/post';
import { ArticlesPageResult, ArticlesServiceInterface } from './articles-service.interface';

const POSTS_KEY = 'posts';
const PAGE_SIZE = 7;
const DEFAULT_POSTS: Post[] = [
  { id: 1, title: 'Первая статья Первая статья', text: 'Текст 1' },
  { id: 2, title: 'Вторая статья Вторая статья', text: 'Текст 2' },
];

@Injectable({
  providedIn: 'root',
})
export class ArticlesService implements ArticlesServiceInterface {
  public getPosts(page: number): Observable<ArticlesPageResult> {
    const normalizedPage = this.normalizePage(page);
    const posts = this.getAllPosts();

    return of(this.buildPageResult(posts, normalizedPage));
  }

  public getTotalCount(): Observable<number> {
    return of(this.getAllPosts().length);
  }

  public addPost(post: NewPost, page: number): Observable<ArticlesPageResult> {
    const posts = this.getAllPosts();
    const newPost: Post = {
      id: this.getNextId(posts),
      title: post.title,
      text: post.text,
    };

    const updatedPosts = [newPost, ...posts];
    this.savePosts(updatedPosts);

    return of(this.buildPageResult(updatedPosts, this.normalizePage(page)));
  }

  public updatePost(id: number, post: NewPost, page: number): Observable<ArticlesPageResult> {
    const posts = this.getAllPosts();
    const updatedPosts = posts.map((currentPost) =>
      currentPost.id === id
        ? { ...currentPost, title: post.title, text: post.text }
        : currentPost,
    );

    this.savePosts(updatedPosts);

    return of(this.buildPageResult(updatedPosts, this.normalizePage(page)));
  }

  public deletePost(id: number, page: number): Observable<ArticlesPageResult> {
    const posts = this.getAllPosts();
    const updatedPosts = posts.filter((post) => post.id !== id);

    this.savePosts(updatedPosts);

    const totalPages = Math.max(1, Math.ceil(updatedPosts.length / PAGE_SIZE));
    const normalizedPage = Math.min(this.normalizePage(page), totalPages);
    return of(this.buildPageResult(updatedPosts, normalizedPage));
  }

  private getAllPosts(): Post[] {
    const rawPosts = localStorage.getItem(POSTS_KEY);

    if (!rawPosts) {
      this.savePosts(DEFAULT_POSTS);
      return DEFAULT_POSTS;
    }

    try {
      return JSON.parse(rawPosts) as Post[];
    } catch {
      this.savePosts(DEFAULT_POSTS);
      return DEFAULT_POSTS;
    }
  }

  private savePosts(posts: Post[]): void {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
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

  private getNextId(posts: Post[]): number {
    if (posts.length === 0) {
      return 1;
    }

    const maxId = Math.max(...posts.map((post) => post.id));
    return maxId + 1;
  }
}
