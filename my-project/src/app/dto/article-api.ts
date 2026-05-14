export interface ArticleApiDto {
  id: string;
  title: string;
  content: string;
  imgSrc?: string | null;
  categoryId: string;
  rating: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ArticlesListApiResponse {
  items: ArticleApiDto[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoryApiDto {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}
