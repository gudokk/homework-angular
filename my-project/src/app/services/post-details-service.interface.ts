import { Observable } from 'rxjs';
import { NewComment } from '../dto/comment';
import { PostDetailsResult } from './types/post-details-result';

export interface PostDetailsServiceInterface {
  getPostDetails(postId: number): Observable<PostDetailsResult>;
  addComment(postId: number, comment: NewComment): Observable<PostDetailsResult>;
  changeCommentRating(postId: number, commentId: number, delta: number): Observable<PostDetailsResult>;
  changeArticleRating(postId: number, delta: number): Observable<PostDetailsResult>;
}
