import { Component } from '@angular/core';
import { BlogList } from '../../components/blog-list/blog-list';
import { AdminPanel, Posts, NewPost } from '../../components/admin-panel/admin-panel';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [BlogList, AdminPanel],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class BlogPage {
  posts: Posts[] = [
    { id: 1, title: 'Первая статья', text: 'Текст 1' },
    { id: 2, title: 'Вторая статья', text: 'Текст 2' },
  ];

  nextId = 3;

  onAddPost(newPost: NewPost) {
    const post: Posts = {
      id: this.nextId,
      title: newPost.title,
      text: newPost.text,
    };

    this.nextId++;

    this.posts = [post, ...this.posts];
  }

  onDeletePost(id: number) {
    this.posts = this.posts.filter(post => post.id !== id);
  }
}