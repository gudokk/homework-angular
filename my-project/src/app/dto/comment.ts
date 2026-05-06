export interface Comment {
  id: number;
  postId: number;
  author: string;
  text: string;
  createdAt: string;
  rating: number;
}

export interface NewComment {
  author: string;
  text: string;
}
