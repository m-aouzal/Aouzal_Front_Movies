import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Movie } from '../Model/movie';
import { Comment } from '../Model/comment'; // Assuming 'comment.ts' is in the same directory as this service

@Injectable({
  providedIn: 'root',
})
export class FilmService {
  private readonly api = 'https://emiflex-60e21-default-rtdb.firebaseio.com';
  private readonly baseurl = 'https://api.themoviedb.org/3/discover/movie';
  private readonly apikey = '4722616a8836f0b929a9cb3a04f6a6a4';
  private readonly dbPath = '/Movies';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.api}${this.dbPath}.json`);
  }

  getComments(movieKey: number): Observable<Comment[]> {
    return this.http
      .get<Comment[]>(`${this.api}${this.dbPath}/${movieKey}/comments.json`)
      .pipe(
        map((response) => {
          const comments: Comment[] = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              comments.push({ ...response[key] });
            }
            console.log(comments);
          }
          return comments;
        }),
        tap((comments) => {
          // Assuming you have a service or method to handle setting comments
          // Replace 'this.recipesService.SetData(comments)' with your actual logic
          // For example, you might have a method like 'this.commentService.setComments(comments)'
        })
      );
  }

  addComment(movieKey: number, comment: Comment): Observable<any> {
    return this.http.post(
      `${this.api}${this.dbPath}/${movieKey}/comments.json`,
      comment
    );
  }

  updateComment(commentId: number, CommentData: any): Observable<any> {
    return this.http.put(
      `${this.api}/Commentaire/${commentId}.json`,
      CommentData
    );
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.api}/Commentaire/${commentId}.json`);
  }

  getPopularMovies(): Observable<any> {
    return this.http.get<any>(`${this.baseurl}?api_key=${this.apikey}`);
  }

  getMovieById(id: number): Observable<any> {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apikey}`;
    return this.http.get<any>(url);
  }

  getImageFromApi(poster_path: string): string {
    return 'https://image.tmdb.org/t/p/w1280' + poster_path;
  }

  searchMovies(moviePrefix: string): Observable<any> {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${this.apikey}&language=en-US&query=${moviePrefix}%20&page=1&include_adult=true`;
    return this.http.get<any>(url).pipe(map((res: any) => res.results));
  }

  addToFavorites(movieKey: number, userId: number): Observable<any> {
    return this.http.post(`${this.api}/users/${userId}/favorites.json`, {
      movieKey,
    });
  }

  removeFromFavorites(movieKey: number, userId: number): Observable<any> {
    return this.http.delete(`${this.api}/users/${userId}/favorites.json`);
  }

  getFavoriteMovies(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/users/${userId}/favorites.json`);
  }
}
