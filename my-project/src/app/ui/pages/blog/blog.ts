import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { BlogList } from '../../components/blog-list/blog-list';
import { AdminPanel } from '../../components/admin-panel/admin-panel';
import { BlogPostForm } from '../../components/blog-post-form/blog-post-form';
import { BlogStatsDialog } from '../../components/blog-stats-dialog/blog-stats-dialog';
import { Post, NewPost } from '../../../dto/post';
import { FormMode } from '../../../dto/form-mode';
import { ARTICLES_SERVICE } from '../../../services/articles-service.token';
import { ArticlesStoreService } from '../../../services/articles-store.service';
import { CategoriesApiService } from '../../../services/categories-api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, BlogList, AdminPanel, BlogPostForm, BlogStatsDialog],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly title = inject(Title);
  private readonly articlesService = inject(ARTICLES_SERVICE);
  private readonly categoriesApi = inject(CategoriesApiService);
  protected readonly articlesStore = inject(ArticlesStoreService);

  protected categoryOptions = signal<string[]>([]);
  protected isFormOpen = false;
  protected editingPost = signal<Post | null>(null);
  protected formMode = computed<FormMode>(() => this.editingPost() ? 'edit' : 'add');
  protected isStatsOpen = false;
  protected readonly posts = this.articlesStore.posts;
  protected readonly activePage = this.articlesStore.activePage;
  protected readonly totalCount = this.articlesStore.totalCount;
  protected readonly totalPages = computed(() => {
    const totalCount = this.totalCount();
    return totalCount === 0 ? 1 : Math.ceil(totalCount / 7);
  });
  protected readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  public ngOnInit(): void {
    this.title.setTitle('Блог | MyProject');

    this.refreshCategoryOptions();

    if (this.posts().length > 0 && this.totalCount() > 0) {
      return;
    }

    this.loadPage(this.articlesService.getStoredActivePage());
  }

  protected openCreateForm(): void {
    this.refreshCategoryOptions();
    this.editingPost.set(null);
    this.isFormOpen = true;
  }

  protected openEditForm(post: Post): void {
    this.refreshCategoryOptions();
    this.editingPost.set(post);
    this.isFormOpen = true;
  }

  protected closePostForm(): void {
    this.editingPost.set(null);
    this.isFormOpen = false;
  }

  protected onSavePost(postData: NewPost): void {
    const editingPost = this.editingPost();
    const currentPage = this.activePage();

    if (this.formMode() === 'edit' && editingPost) {
      this.articlesService
        .updatePost(editingPost.id, postData, currentPage)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((result) => {
          this.syncStore(result.posts, result.activePage, result.totalCount);
        });
    } else {
      this.articlesService
        .addPost(postData, currentPage)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((result) => {
          this.syncStore(result.posts, result.activePage, result.totalCount);
        });
    }

    this.closePostForm();
  }

  protected onDeletePost(id: string): void {
    this.articlesService
      .deletePost(id, this.activePage())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.syncStore(result.posts, result.activePage, result.totalCount);
      });

    const editingPost = this.editingPost();
    if (editingPost?.id === id) {
      this.closePostForm();
    }
  }

  protected goToPage(page: number): void {
    if (page === this.activePage()) {
      return;
    }

    this.loadPage(page);
  }

  protected nextPage(): void {
    if (this.activePage() >= this.totalPages()) {
      return;
    }

    this.loadPage(this.activePage() + 1);
  }

  protected prevPage(): void {
    if (this.activePage() <= 1) {
      return;
    }

    this.loadPage(this.activePage() - 1);
  }

  private loadPage(page: number): void {
    this.articlesService
      .getPosts(page)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.syncStore(result.posts, result.activePage, result.totalCount);
      });
  }

  private syncStore(posts: Post[], page: number, totalCount: number): void {
    this.articlesStore.setPosts(posts);
    this.articlesStore.setActivePage(page);
    this.articlesStore.setTotalCount(totalCount);
    this.refreshCategoryOptions();
  }

  private refreshCategoryOptions(): void {
    if (environment.articlesSource === 'api') {
      this.categoriesApi
        .getAll()
        .pipe(take(1))
        .subscribe((list) => {
          this.categoryOptions.set(this.categoriesApi.getNames(list));
        });
      return;
    }

    this.categoryOptions.set(this.articlesService.getCategorySuggestions());
  }
}