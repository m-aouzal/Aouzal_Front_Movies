import { Comment } from './comment';

export class Movie {
  id: number;
  isFavorite?: boolean;
  comments?: Comment[];
}
