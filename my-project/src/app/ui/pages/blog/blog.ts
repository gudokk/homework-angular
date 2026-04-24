import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogList } from '../../components/blog-list/blog-list';
import { AdminPanel } from '../../components/admin-panel/admin-panel';
import { BlogPostForm } from '../../components/blog-post-form/blog-post-form';
import { BlogStatsDialog } from '../../components/blog-stats-dialog/blog-stats-dialog';
import { Post, NewPost } from '../../../dto/post';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, BlogList, AdminPanel, BlogPostForm, BlogStatsDialog],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class BlogPage {
  protected posts: Post[] = [
    { id: 1, title: 'Первая статья Первая статья', text: 'Текст 1' },
    { id: 2, title: 'Вторая статья Вторая статья', text: 'Текст 2' },
  ];

  protected nextId = 3;

  protected formMode: 'add' | 'edit' = 'add';
  protected isFormOpen = false;
  protected editingPost: Post | null = null;
  protected isStatsOpen = false;

  // открыть форму для добавления
  protected openCreateForm(): void {
    this.formMode = 'add';
    this.editingPost = null;
    this.isFormOpen = true;
  }

  // открыть форму для редактирования
  protected openEditForm(post: Post): void {
    this.formMode = 'edit';
    this.editingPost = post;
    this.isFormOpen = true;
  }

  // закрыть форму
  protected closePostForm(): void {
    this.editingPost = null;
    this.formMode = 'add';
    this.isFormOpen = false;
  }

  // сохранить данные
  protected onSavePost(postData: NewPost): void {
    if (this.formMode === 'edit' && this.editingPost) {
      this.posts = this.posts.map(post =>
        post.id === this.editingPost!.id
          ? { ...post, ...postData }
          : post
      );
    } else {
      const post: Post = {
        id: this.nextId++,
        title: postData.title,
        text: postData.text,
      };
      this.posts = [post, ...this.posts];
    }
    this.closePostForm();
  }

  // удалить статью
  protected onDeletePost(id: number): void {
    this.posts = this.posts.filter(post => post.id !== id);
  }
}