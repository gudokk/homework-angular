import { Observable } from 'rxjs';
import { NewComment } from '../dto/comment';
import { PostDetailsResult } from './types/post-details-result';

export interface PostDetailsServiceInterface {
  getPostDetails(postId: string): Observable<PostDetailsResult>;
  addComment(postId: string, comment: NewComment): Observable<PostDetailsResult>;
  changeCommentRating(postId: string, commentId: string, delta: number): Observable<PostDetailsResult>;
  changeArticleRating(postId: string, delta: number): Observable<PostDetailsResult>;
}
