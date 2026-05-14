import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Inject, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NewComment } from '../../../dto/comment';
import { PostDetailsStoreService } from '../../../services/post-details-store.service';
import { POST_DETAILS_SERVICE } from '../../../services/post-details-service.token';
import { PostDetailsServiceInterface } from '../../../services/post-details-service.interface';
import { PostDetailsApiService } from '../../../services/post-details-api.service';
import { PostDetailsLocalStorageService } from '../../../services/post-details-local-storage.service';
import { environment } from '../../../../environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

const postDetailsServiceClass =
  environment.articlesSource === 'api'
    ? PostDetailsApiService
    : PostDetailsLocalStorageService;

@Component({
  selector: 'app-post-details-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatInputModule, MatIconModule, MatFormFieldModule],
  templateUrl: './post-details.html',
  styleUrl: './post-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    PostDetailsStoreService,
    {
      provide: POST_DETAILS_SERVICE,
      useClass: postDetailsServiceClass,
    },
  ],
})
export class PostDetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly title = inject(Title);

  protected readonly detailsStore = inject(PostDetailsStoreService);
  protected readonly post = this.detailsStore.post;
  protected readonly comments = this.detailsStore.comments;
  protected readonly articleRating = this.detailsStore.articleRating;
  protected readonly hasPost = this.detailsStore.hasPost;

  protected readonly commentAuthor = signal('');
  protected readonly commentText = signal('');
  protected readonly isCommentFormInvalid = computed(
    () => this.commentAuthor().trim().length === 0 || this.commentText().trim().length === 0,
  );

  constructor(
    @Inject(POST_DETAILS_SERVICE)
    private readonly postDetailsService: PostDetailsServiceInterface,
  ) {}

  public ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = params.get('id')?.trim() ?? '';
      if (!id) {
        this.title.setTitle('Пост не найден | MyProject');
        this.detailsStore.setData({
          post: null,
          comments: [],
          articleRating: 0,
        });
        return;
      }

      this.loadPostDetails(id);
    });
  }

  protected setCommentAuthor(author: string): void {
    this.commentAuthor.set(author);
  }

  protected setCommentText(text: string): void {
    this.commentText.set(text);
  }

  protected onCommentFormSubmit(event: Event): void {
    event.preventDefault();
    this.addComment();
  }

  private addComment(): void {
    if (this.isCommentFormInvalid() || !this.post()) {
      return;
    }

    const post = this.post();
    if (!post) {
      return;
    }

    const newComment: NewComment = {
      author: this.commentAuthor(),
      text: this.commentText(),
    };

    this.postDetailsService
      .addComment(post.id, newComment)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.detailsStore.setData(data);
        this.commentAuthor.set('');
        this.commentText.set('');
      });
  }

  protected changeArticleRating(delta: number): void {
    const post = this.post();
    if (!post) {
      return;
    }

    this.postDetailsService
      .changeArticleRating(post.id, delta)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.detailsStore.setData(data);
      });
  }

  protected changeCommentRating(commentId: string, delta: number): void {
    const post = this.post();
    if (!post) {
      return;
    }

    this.postDetailsService
      .changeCommentRating(post.id, commentId, delta)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.detailsStore.setData(data);
      });
  }

  private loadPostDetails(postId: string): void {
    this.postDetailsService
      .getPostDetails(postId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.detailsStore.setData(data);
        this.title.setTitle(data.post ? `${data.post.title} | MyProject` : 'Пост не найден | MyProject');
      });
  }
}
