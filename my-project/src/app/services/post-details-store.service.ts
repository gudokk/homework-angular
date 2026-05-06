import { Injectable, computed, signal } from '@angular/core';
import { Comment } from '../dto/comment';
import { Post } from '../dto/post';
import { PostDetailsResult } from './types/post-details-result';

@Injectable()
export class PostDetailsStoreService {
  public readonly post = signal<Post | null>(null);
  public readonly comments = signal<Comment[]>([]);
  public readonly articleRating = signal(0);
  public readonly hasPost = computed(() => this.post() !== null);

  public setData(data: PostDetailsResult): void {
    this.post.set(data.post);
    this.comments.set(data.comments);
    this.articleRating.set(data.articleRating);
  }
}
