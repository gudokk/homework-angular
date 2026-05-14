export interface Post {
  id: string;
  title: string;
  text: string;
  imageUrl?: string | null;
  categoryId?: string;
  categoryName?: string;
  rating?: number;
}

export interface NewPost {
  title: string;
  text: string;
  categoryName: string;
  imageFile?: File | null;
}
