import { Component, OnInit } from '@angular/core';
import { FilmService } from '../Service/film.service';
import { User } from '../login/user.model';
import { HashService } from '../Service/hash.service';
import { Film } from '../Model/film';
import { UsersloginService } from '../Service/users.login.service';
import { FilmCardComponent } from '../filmCard/filmCard.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-favorites',
  templateUrl: './MyFavorites.component.html',
  styleUrls: ['./MyFavorites.component.css'],
  standalone: true,
  imports: [FilmCardComponent, CommonModule],
})
export class MyFavoritesComponent implements OnInit {
  favoriteMovies: Film[] = [];
  user: User;
  userId: number;
  isFavorite: boolean = true;
  film: Film;

  constructor(
    private filmService: FilmService,
    private usersService: UsersloginService,
    private hash: HashService
  ) {}

  ngOnInit(): void {
    this.usersService.userSubject.subscribe((user) => {
      this.user = user;
      this.userId = this.hash.hashCode(this.user.email);
      this.loadFavoriteMovies();
    });
  }

  loadFavoriteMovies() {
    console.log('Fetching favorite movies...');
    this.filmService.getFavoriteMovies(this.userId).subscribe(
      (movies) => {
        console.log('Favorite movies:', movies);
        this.favoriteMovies = movies;
      },
      (error) => {
        console.error('Error fetching favorite movies:', error);
      }
    );
  }
  onFavoriteRemoved(movieId: number) {
    console.log('Removing favorite movie with ID:', movieId);
    // You may want to update the local favoriteMovies array
    this.favoriteMovies = this.favoriteMovies.filter(
      (movie) => movie.id !== movieId
    );
  }
}
