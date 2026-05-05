import { Injectable, signal } from '@angular/core';
import { Post } from '../dto/post';

@Injectable({
  providedIn: 'root',
})
export class ArticlesStoreService {
  public readonly posts = signal<Post[]>([]);
  public readonly activePage = signal(1);
  public readonly totalCount = signal(0);

  public setPosts(posts: Post[]): void {
    this.posts.set(posts);
  }

  public setActivePage(page: number): void {
    this.activePage.set(page);
  }

  public setTotalCount(totalCount: number): void {
    this.totalCount.set(totalCount);
  }
}
