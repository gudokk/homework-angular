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
export class PostDetailsService implements PostDetailsServiceInterface {
  public getPostDetails(postId: number): Observable<PostDetailsResult> {
    return of(this.buildResult(postId));
  }

  public addComment(postId: number, comment: NewComment): Observable<PostDetailsResult> {
    const commentsByPost = this.getCommentsByPost();
    const comments = commentsByPost[postId] ?? [];
    const newComment: Comment = {
      id: this.getNextCommentId(comments),
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

  public changeCommentRating(postId: number, commentId: number, delta: number): Observable<PostDetailsResult> {
    const commentsByPost = this.getCommentsByPost();
    const comments = commentsByPost[postId] ?? [];

    commentsByPost[postId] = comments.map((comment) =>
      comment.id === commentId ? { ...comment, rating: comment.rating + delta } : comment,
    );

    this.saveCommentsByPost(commentsByPost);
    return of(this.buildResult(postId));
  }

  public changeArticleRating(postId: number, delta: number): Observable<PostDetailsResult> {
    const ratings = this.getArticleRatings();
    const currentRating = ratings[postId] ?? 0;

    ratings[postId] = currentRating + delta;
    this.saveArticleRatings(ratings);
    return of(this.buildResult(postId));
  }

  private buildResult(postId: number): PostDetailsResult {
    const post = this.getPostById(postId);
    const commentsByPost = this.getCommentsByPost();
    const ratings = this.getArticleRatings();

    return {
      post,
      comments: commentsByPost[postId] ?? [],
      articleRating: ratings[postId] ?? 0,
    };
  }

  private getPostById(postId: number): Post | null {
    const posts = this.getAllPosts();
    return posts.find((post) => post.id === postId) ?? null;
  }

  private getAllPosts(): Post[] {
    const rawPosts = localStorage.getItem(POSTS_KEY);
    if (!rawPosts) {
      return [];
    }

    try {
      return JSON.parse(rawPosts) as Post[];
    } catch {
      return [];
    }
  }

  private getCommentsByPost(): Record<number, Comment[]> {
    const rawComments = localStorage.getItem(COMMENTS_KEY);
    if (!rawComments) {
      return {};
    }

    try {
      return JSON.parse(rawComments) as Record<number, Comment[]>;
    } catch {
      return {};
    }
  }

  private saveCommentsByPost(commentsByPost: Record<number, Comment[]>): void {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(commentsByPost));
  }

  private getArticleRatings(): Record<number, number> {
    const rawRatings = localStorage.getItem(ARTICLE_RATINGS_KEY);
    if (!rawRatings) {
      return {};
    }

    try {
      return JSON.parse(rawRatings) as Record<number, number>;
    } catch {
      return {};
    }
  }

  private saveArticleRatings(ratings: Record<number, number>): void {
    localStorage.setItem(ARTICLE_RATINGS_KEY, JSON.stringify(ratings));
  }

  private getNextCommentId(comments: Comment[]): number {
    if (comments.length === 0) {
      return 1;
    }

    return Math.max(...comments.map((comment) => comment.id)) + 1;
  }
}
