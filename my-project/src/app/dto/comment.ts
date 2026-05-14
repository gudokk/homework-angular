export interface Comment {
  id: string;
  postId: string;
  author: string;
  text: string;
  createdAt: string;
  rating: number;
}

export interface NewComment {
  author: string;
  text: string;
}
