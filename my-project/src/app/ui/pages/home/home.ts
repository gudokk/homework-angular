import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ARTICLES_SERVICE } from '../../../services/articles-service.token';
import { ArticlesServiceInterface } from '../../../services/articles-service.interface';
import { ArticlesStoreService } from '../../../services/articles-store.service';
import { Post } from '../../../dto/post';
import { HomeAboutSection } from '../../components/home-about-section/home-about-section';
import { HomeLatestPostsSection } from '../../components/home-latest-posts-section/home-latest-posts-section';
import { HomeSkillsSection } from '../../components/home-skills-section/home-skills-section';
import { HomeWorkSection } from '../../components/home-work-section/home-work-section';
import { HomeHobbySection } from '../../components/home-hobby-section/home-hobby-section';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HomeAboutSection,
    HomeLatestPostsSection,
    HomeSkillsSection,
    HomeWorkSection,
    HomeHobbySection,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HomePage implements OnInit {
  protected latestPosts: Post[] = [];

  constructor(
    @Inject(ARTICLES_SERVICE) private readonly articlesService: ArticlesServiceInterface,
    private readonly articlesStore: ArticlesStoreService,
  ) {}

  public ngOnInit(): void {
    if (this.articlesStore.posts.length > 0 && this.articlesStore.activePage === 1) {
      this.latestPosts = this.articlesStore.posts.slice(0, 2);
      return;
    }

    this.articlesService.getPosts(1).subscribe((result) => {
      this.articlesStore.setPosts(result.posts);
      this.articlesStore.setTotalCount(result.totalCount);
      this.latestPosts = result.posts.slice(0, 2);
    });
  }
}
