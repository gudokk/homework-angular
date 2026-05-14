import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ArticleApiDto } from '../dto/article-api';
import { Comment, NewComment } from '../dto/comment';
import { ArticleMapperService } from './article-mapper.service';
import { CategoriesApiService } from './categories-api.service';
import { PostDetailsServiceInterface } from './post-details-service.interface';
import { PostDetailsResult } from './types/post-details-result';

interface CommentApiDto {
  id: string;
  username: string;
  content: string;
  articleId: string;
  rating: number;
  createdAt: string;
}

@Injectable()
export class PostDetailsApiService implements PostDetailsServiceInterface {
  constructor(
    private readonly http: HttpClient,
    private readonly articleMapper: ArticleMapperService,
    private readonly categoriesApi: CategoriesApiService,
  ) {}

  public getPostDetails(postId: string): Observable<PostDetailsResult> {
    return forkJoin({
      article: this.http.get<ArticleApiDto>(`/api/articles/${postId}`),
      comments: this.http.get<CommentApiDto[]>(`/api/comments/article/${postId}`),
      categories: this.categoriesApi.getAll(),
    }).pipe(
      map(({ article, comments, categories }) => {
        const categoryName = categories.find((c) => c.id === article.categoryId)?.name;
        const post = this.articleMapper.articleToPost(article, categoryName);
        return {
          post,
          comments: comments.map((c) => this.mapComment(c)),
          articleRating: article.rating,
        };
      }),
      catchError(() =>
        of<PostDetailsResult>({
          post: null,
          comments: [],
          articleRating: 0,
        }),
      ),
    );
  }

  public addComment(postId: string, comment: NewComment): Observable<PostDetailsResult> {
    return this.http
      .post<CommentApiDto>('/api/comments', {
        username: comment.author.trim(),
        content: comment.text.trim(),
        articleId: postId,
      })
      .pipe(switchMap(() => this.getPostDetails(postId)));
  }

  public changeCommentRating(
    postId: string,
    commentId: string,
    delta: number,
  ): Observable<PostDetailsResult> {
    return this.http.get<CommentApiDto[]>(`/api/comments/article/${postId}`).pipe(
      switchMap((list) => {
        const current = list.find((c) => c.id === commentId);
        if (!current) {
          return this.getPostDetails(postId);
        }
        const nextRating = current.rating + delta;
        return this.http
          .patch<CommentApiDto>(`/api/comments/${commentId}/rating`, { rating: nextRating })
          .pipe(switchMap(() => this.getPostDetails(postId)));
      }),
    );
  }

  public changeArticleRating(postId: string, delta: number): Observable<PostDetailsResult> {
    const abs = Math.min(Math.abs(delta), 50);
    if (abs === 0) {
      return this.getPostDetails(postId);
    }

    const url =
      delta >= 0
        ? `/api/articles/${postId}/rating-up`
        : `/api/articles/${postId}/rating-down`;
    const calls = Array.from({ length: abs }, () =>
      this.http.patch<ArticleApiDto>(url, {}),
    );
    return forkJoin(calls).pipe(switchMap(() => this.getPostDetails(postId)));
  }

  private mapComment(dto: CommentApiDto): Comment {
    return {
      id: dto.id,
      postId: dto.articleId,
      author: dto.username,
      text: dto.content,
      createdAt: dto.createdAt,
      rating: dto.rating,
    };
  }
}
