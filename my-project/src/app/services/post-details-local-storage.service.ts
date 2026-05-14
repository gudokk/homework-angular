import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Comment, NewComment } from '../dto/comment';
import { Post } from '../dto/post';
import { PostDetailsServiceInterface } from './post-details-service.interface';
import { PostDetailsResult } from './types/post-details-result';

const POSTS_KEY = 'posts';
const COMMENTS_KEY = 'postComments';
const ARTICLE_RATINGS_KEY = 'postRatings';

@Injectable()
export class PostDetailsLocalStorageService implements PostDetailsServiceInterface {
  public getPostDetails(postId: string): Observable<PostDetailsResult> {
    return of(this.buildResult(postId));
  }

  public addComment(postId: string, comment: NewComment): Observable<PostDetailsResult> {
    const commentsByPost = this.getCommentsByPost();
    const comments = commentsByPost[postId] ?? [];
    const newComment: Comment = {
      id: crypto.randomUUID(),
      postId,
      author: comment.author.trim(),
      text: comment.text.trim(),
      createdAt: new Date().toISOString(),
      rating: 0,
    };

    commentsByPost[postId] = [newComment, ...comments];
    this.saveCommentsByPost(commentsByPost);
    return of(this.buildResult(postId));
  }

  public changeCommentRating(
    postId: string,
    commentId: string,
    delta: number,
  ): Observable<PostDetailsResult> {
    const commentsByPost = this.getCommentsByPost();
    const comments = commentsByPost[postId] ?? [];

    commentsByPost[postId] = comments.map((item) =>
      item.id === commentId ? { ...item, rating: item.rating + delta } : item,
    );

    this.saveCommentsByPost(commentsByPost);
    return of(this.buildResult(postId));
  }

  public changeArticleRating(postId: string, delta: number): Observable<PostDetailsResult> {
    const ratings = this.getArticleRatings();
    const currentRating = ratings[postId] ?? 0;

    ratings[postId] = currentRating + delta;
    this.saveArticleRatings(ratings);
    return of(this.buildResult(postId));
  }

  private buildResult(postId: string): PostDetailsResult {
    const post = this.getPostById(postId);
    const commentsByPost = this.getCommentsByPost();
    const ratings = this.getArticleRatings();

    return {
      post,
      comments: commentsByPost[postId] ?? [],
      articleRating: ratings[postId] ?? post?.rating ?? 0,
    };
  }

  private getPostById(postId: string): Post | null {
    const posts = this.getAllPosts();
    return posts.find((post) => post.id === postId) ?? null;
  }

  private getAllPosts(): Post[] {
    const rawPosts = localStorage.getItem(POSTS_KEY);
    if (!rawPosts) {
      return [];
    }

    try {
      const parsed = JSON.parse(rawPosts) as unknown;
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed
        .map((item) => this.coercePost(item))
        .filter((p): p is Post => p !== null);
    } catch {
      return [];
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
    if (!id) {
      return null;
    }
    return {
      id,
      title,
      text,
      imageUrl: record['imageUrl'] != null ? String(record['imageUrl']) : null,
      categoryName: record['categoryName'] != null ? String(record['categoryName']) : undefined,
      rating: typeof record['rating'] === 'number' ? record['rating'] : undefined,
    };
  }

  private getCommentsByPost(): Record<string, Comment[]> {
    const rawComments = localStorage.getItem(COMMENTS_KEY);
    if (!rawComments) {
      return {};
    }

    try {
      const parsed = JSON.parse(rawComments) as Record<string, Comment[]>;
      return this.migrateCommentsMap(parsed);
    } catch {
      return {};
    }
  }

  private migrateCommentsMap(
    parsed: Record<string, Comment[]>,
  ): Record<string, Comment[]> {
    const next: Record<string, Comment[]> = {};
    for (const [key, value] of Object.entries(parsed)) {
      const postKey = String(key);
      if (!Array.isArray(value)) {
        continue;
      }
      next[postKey] = value.map((c) => ({
        ...c,
        id: String(c.id),
        postId: String(c.postId),
      }));
    }
    return next;
  }

  private saveCommentsByPost(commentsByPost: Record<string, Comment[]>): void {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(commentsByPost));
  }

  private getArticleRatings(): Record<string, number> {
    const rawRatings = localStorage.getItem(ARTICLE_RATINGS_KEY);
    if (!rawRatings) {
      return {};
    }

    try {
      const parsed = JSON.parse(rawRatings) as Record<string, number>;
      const next: Record<string, number> = {};
      for (const [key, value] of Object.entries(parsed)) {
        next[String(key)] = value;
      }
      return next;
    } catch {
      return {};
    }
  }

  private saveArticleRatings(ratings: Record<string, number>): void {
    localStorage.setItem(ARTICLE_RATINGS_KEY, JSON.stringify(ratings));
  }
}
