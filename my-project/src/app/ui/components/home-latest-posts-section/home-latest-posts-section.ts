import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../../dto/post';

@Component({
  selector: 'app-home-latest-posts-section',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-latest-posts-section.html',
})
export class HomeLatestPostsSection {
  public posts = input.required<Post[]>();
}
