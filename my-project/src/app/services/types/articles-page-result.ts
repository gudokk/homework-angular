import { Post } from '../../dto/post';

export interface ArticlesPageResult {
  posts: Post[];
  totalCount: number;
  totalPages: number;
  activePage: number;
}
