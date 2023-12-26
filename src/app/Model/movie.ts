import { Comment } from './comment';

export class Movie {
  id: number;
  isFavorite: boolean = false;
  comments: Comment[];
}
