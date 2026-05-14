import { Injectable } from '@angular/core';
import { ArticleApiDto } from '../dto/article-api';
import { Post } from '../dto/post';

@Injectable({
  providedIn: 'root',
})
export class ArticleMapperService {
  public articleToPost(dto: ArticleApiDto, categoryName?: string): Post {
    return {
      id: dto.id,
      title: dto.title,
      text: dto.content,
      imageUrl: dto.imgSrc ? this.normalizeMediaPath(dto.imgSrc) : null,
      categoryId: dto.categoryId,
      categoryName,
      rating: dto.rating,
    };
  }

  /** Относительный URL для dev-proxy (`/uploads/...`) или абсолютный с бэкенда */
  public normalizeMediaPath(imgSrc: string): string {
    if (imgSrc.startsWith('http://') || imgSrc.startsWith('https://')) {
      return imgSrc;
    }
    return imgSrc.startsWith('/') ? imgSrc : `/${imgSrc}`;
  }
}
