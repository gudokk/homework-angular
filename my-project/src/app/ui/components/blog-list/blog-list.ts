import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Post } from '../../../dto/post';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.scss',
})
export class BlogList {
  @Input() posts: Post[] = [];

  @Output() deletePost = new EventEmitter<number>();
  @Output() editPost = new EventEmitter<Post>();

  protected removePost(event: Event, id: number):void {
    event.preventDefault();
    event.stopPropagation();
    this.deletePost.emit(id);
  }

  protected onEditPost(event: Event, post: Post):void {
    event.preventDefault();
    event.stopPropagation();
    this.editPost.emit(post);
  }
}