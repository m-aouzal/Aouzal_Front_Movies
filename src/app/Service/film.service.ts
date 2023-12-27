import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { Movie } from '../Model/movie';
import { Comment } from '../Model/comment';
import { of } from 'rxjs';
import { UsersloginService } from './users.login.service';
import { User } from '../login/user.model';
import { Favorite } from '../Model/Favorite';
import { forkJoin } from 'rxjs';
import { Film } from '../Model/film';

@Injectable({
  providedIn: 'root',
})
export class FilmService {
  private readonly api = 'https://emiflex-60e21-default-rtdb.firebaseio.com';
  private readonly baseurl = 'https://api.themoviedb.org/3/discover/movie';
  private readonly apikey = '4722616a8836f0b929a9cb3a04f6a6a4';
  private readonly dbPath = '/Movies';
  favoritesChanged: Subject<Favorite[]> = new Subject<Favorite[]>();
  favoritesMoviesIds: Subject<number[]> = new Subject<number[]>();
  commentsChanged: Subject<Comment[]> = new Subject<Comment[]>();
  user: User;
  constructor(
    private http: HttpClient,
    private usersService: UsersloginService
  ) {}

  getAll(): Observable<Film[]> {
    return this.http.get<Film[]>(`${this.api}${this.dbPath}.json`);
  }

  getComments(movieKey: number): Observable<Comment[]> {
    return this.http
      .get<Comment[]>(`${this.api}${this.dbPath}/${movieKey}/comments.json`)
      .pipe(
        map((response) => {
          if (!response) {
            return [];
          }

          const comments: Comment[] = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              comments.push({ id: key, ...response[key] }); // Assign the ID
            }
          }
          return comments;
        }),
        tap((comments) => {
          this.commentsChanged.next(comments); // Notify subscribers about comments changes
        })
      );
  }

  updateComment(
    movieKey: number,
    commentId: number,
    CommentData: any
  ): Observable<any> {
    return this.http.put(
      `${this.api}${this.dbPath}/${movieKey}/comments/${commentId}.json`,
      CommentData
    );
  }

  deleteComment(movieKey: number, commentId: number): Observable<any> {
    console.log('Deleting comment with id:', movieKey);
    return this.http
      .delete<Comment>(
        `${this.api}${this.dbPath}/${movieKey}/comments/${commentId}.json`
      )
      .pipe(
        switchMap(() => this.getComments(movieKey)),
        tap((comments) => {
          this.commentsChanged.next(comments); // Notify about comments changes
        })
      );
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

  getFavoriteMovies(userId: number): Observable<Film[]> {
    return this.getFavoriteMoviesIds(userId).pipe(
      switchMap((favoriteMovieIds) => {
        const moviesRequests: Observable<Film>[] = [];

        for (const favorite of favoriteMovieIds) {
          const movieRequest = this.getMovieById(favorite);
          moviesRequests.push(movieRequest);
        }

        return forkJoin(moviesRequests);
      })
    );
  }

  private extractMovieIdsFromFavorites(favoriteMovies: Favorite[]): number[] {
    return favoriteMovies.map((favorite) => favorite.movieKey);
  }

  // Get favorite movie IDs
  getFavoriteMoviesIds(userId: number): Observable<number[]> {
    console.log(userId);
    return this.http
      .get<Favorite[]>(`${this.api}/users/${userId}/favorites.json`)
      .pipe(
        map((response: Favorite[]) => {
          console.log('Received favorite movies:', response);

          // Filter out null or undefined favorites and extract movie IDs
          const movieIds = response
            .filter(
              (favorite) => favorite && typeof favorite.movieKey === 'number'
            )
            .map((favorite) => favorite.movieKey);

          console.log('Extracted movie IDs:', movieIds);

          return movieIds; // Return extracted movie IDs
        }),
        tap((favorites) => {
          // Notify subscribers about favorites changes
          this.favoritesMoviesIds.next(favorites);
        })
      );
  }

  addComment(movieKey: number, comment: Comment): Observable<any> {
    return this.getComments(movieKey).pipe(
      switchMap((existingComments) => {
        const updatedComments = [...existingComments, comment];
        return this.putComments(movieKey, updatedComments);
      })
    );
  }

  private putComments(movieKey: number, comments: Comment[]): Observable<any> {
    return this.http.put(
      `${this.api}${this.dbPath}/${movieKey}/comments.json`,
      comments
    );
  }
  getFavorites(userId: number): Observable<Favorite[]> {
    return this.http
      .get<Favorite[]>(`${this.api}/users/${userId}/favorites.json`)
      .pipe(
        map((response) => response || []),
        tap((favorites) => {
          this.favoritesChanged.next(favorites);
          this.favoritesMoviesIds.next(
            this.extractMovieIdsFromFavorites(favorites)
          );
        })
      );
  }
  addFavoriteMovie(userId: number, movieKey: number): Observable<any> {
    return this.getFavorites(userId).pipe(
      switchMap((favorites) => {
        if (favorites.some((favorite) => favorite.movieKey === movieKey)) {
          return of(favorites); // Film already in favorites, no need to add
        }

        const updatedFavorites = [...favorites, { movieKey }];

        // Update the favorites list on the server
        return this.http
          .put(`${this.api}/users/${userId}/favorites.json`, updatedFavorites)
          .pipe(
            tap(() => {
              // Notify subscribers about favorites changes
              this.favoritesChanged.next(updatedFavorites);
              // Notify subscribers specifically about changes in movie IDs
              this.favoritesMoviesIds.next(
                this.extractMovieIdsFromFavorites(updatedFavorites)
              );
            })
          );
      })
    );
  }

  // Remove a movie from favorites
  removeFavoriteMovie(userId: number, movieKey: number): Observable<any> {
    // Assuming movieKey is used as an identifier
    return this.http.delete<any>(
      `${this.api}/users/${userId}/favorites/${movieKey}.json`
    );
  }
}
