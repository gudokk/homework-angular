import { Component, computed, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogList } from '../../components/blog-list/blog-list';
import { AdminPanel } from '../../components/admin-panel/admin-panel';
import { BlogPostForm } from '../../components/blog-post-form/blog-post-form';
import { BlogStatsDialog } from '../../components/blog-stats-dialog/blog-stats-dialog';
import { Post, NewPost } from '../../../dto/post';
import { FormMode } from '../../../dto/form-mode';
import { ARTICLES_SERVICE } from '../../../services/articles-service.token';
import { ArticlesServiceInterface } from '../../../services/articles-service.interface';
import { ArticlesStoreService } from '../../../services/articles-store.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, BlogList, AdminPanel, BlogPostForm, BlogStatsDialog],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class BlogPage implements OnInit {
  protected isFormOpen = false;
  protected editingPost = signal<Post | null>(null);
  protected formMode = computed<FormMode>(() => this.editingPost() ? 'edit' : 'add');
  protected isStatsOpen = false;

  constructor(
    @Inject(ARTICLES_SERVICE) private readonly articlesService: ArticlesServiceInterface,
    protected readonly articlesStore: ArticlesStoreService,
  ) {}

  protected get posts(): Post[] {
    return this.articlesStore.posts;
  }

  protected get activePage(): number {
    return this.articlesStore.activePage;
  }

  protected get totalCount(): number {
    return this.articlesStore.totalCount;
  }

  protected get totalPages(): number {
    if (this.totalCount === 0) {
      return 1;
    }

    return Math.ceil(this.totalCount / 7);
  }

  protected get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  public ngOnInit(): void {
    if (this.articlesStore.posts.length > 0 && this.articlesStore.totalCount > 0) {
      return;
    }

    this.loadPage(this.articlesStore.activePage);
  }

  protected openCreateForm(): void {
    this.editingPost.set(null);
    this.isFormOpen = true;
  }

  protected openEditForm(post: Post): void {
    this.editingPost.set(post);
    this.isFormOpen = true;
  }

  protected closePostForm(): void {
    this.editingPost.set(null);
    this.isFormOpen = false;
  }

  protected onSavePost(postData: NewPost): void {
    const editingPost = this.editingPost();
    const currentPage = this.activePage;

    if (this.formMode() === 'edit' && editingPost) {
      this.articlesService.updatePost(editingPost.id, postData, currentPage).subscribe((result) => {
        this.syncStore(result.posts, result.activePage, result.totalCount);
      });
    } else {
      this.articlesService.addPost(postData, currentPage).subscribe((result) => {
        this.syncStore(result.posts, result.activePage, result.totalCount);
      });
    }

    this.closePostForm();
  }

  protected onDeletePost(id: number): void {
    this.articlesService.deletePost(id, this.activePage).subscribe((result) => {
      this.syncStore(result.posts, result.activePage, result.totalCount);
    });

    const editingPost = this.editingPost();
    if (editingPost?.id === id) {
      this.closePostForm();
    }
  }

  protected goToPage(page: number): void {
    if (page === this.activePage) {
      return;
    }

    this.loadPage(page);
  }

  protected nextPage(): void {
    if (this.activePage >= this.totalPages) {
      return;
    }

    this.loadPage(this.activePage + 1);
  }

  protected prevPage(): void {
    if (this.activePage <= 1) {
      return;
    }

    this.loadPage(this.activePage - 1);
  }

  private loadPage(page: number): void {
    this.articlesService.getPosts(page).subscribe((result) => {
      this.syncStore(result.posts, result.activePage, result.totalCount);
    });
  }

  private syncStore(posts: Post[], page: number, totalCount: number): void {
    this.articlesStore.setPosts(posts);
    this.articlesStore.setActivePage(page);
    this.articlesStore.setTotalCount(totalCount);
  }
}