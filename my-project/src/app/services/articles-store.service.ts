import { Injectable } from '@angular/core';
import { Post } from '../dto/post';

const ACTIVE_PAGE_KEY = 'activePage';

@Injectable({
  providedIn: 'root',
})
export class ArticlesStoreService {
  posts: Post[] = [];
  activePage = Number(localStorage.getItem(ACTIVE_PAGE_KEY) ?? '1');
  totalCount = 0;

  setPosts(posts: Post[]): void {
    this.posts = posts;
  }

  setActivePage(page: number): void {
    this.activePage = page;
    localStorage.setItem(ACTIVE_PAGE_KEY, String(page));
  }

  setTotalCount(totalCount: number): void {
    this.totalCount = totalCount
  }
}
