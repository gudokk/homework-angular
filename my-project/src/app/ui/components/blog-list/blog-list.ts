import { Component, Input, Output, EventEmitter } from '@angular/core';

interface Post {
  id: number;
  title: string;
  text: string;
}

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.scss',
})
export class BlogList {
  @Input() posts: Post[] = [];

  @Output() deletePost = new EventEmitter<number>();

  removePost(id: number) {
    this.deletePost.emit(id);
  }
}