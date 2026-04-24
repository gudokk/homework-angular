import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../../../dto/post';

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
  @Output() editPost = new EventEmitter<Post>();

  protected removePost(id: number):void {
    this.deletePost.emit(id);
  }

  protected onEditPost (post: Post):void {
    this.editPost.emit(post);
  }
}