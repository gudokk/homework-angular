import { Comment } from '../../dto/comment';
import { Post } from '../../dto/post';

export interface PostDetailsResult {
  post: Post | null;
  comments: Comment[];
  articleRating: number;
}
