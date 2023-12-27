import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Film } from '../Model/film';
import { FilmService } from '../Service/film.service';
import { UsersloginService } from '../Service/users.login.service';
import { User } from '../login/user.model';
import { HashService } from '../Service/hash.service';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-film-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, MatButtonModule],
  templateUrl: './filmCard.component.html',
  styleUrls: ['./filmCard.component.css'],
})
export class FilmCardComponent implements OnInit {
  @Input() film!: Film;
  @Input() isFavoritesPage: boolean = false;
  @Output() favoriteRemoved: EventEmitter<number> = new EventEmitter<number>();
  isFavorite: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  user: User;
  userId: number;
  favoriteMovies: Film[] = [];

  constructor(
    private filmService: FilmService,
    private usersService: UsersloginService,
    private hash: HashService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usersService.userSubject.subscribe((user) => {
      this.user = user;
      this.userId = this.hash.hashCode(this.user.email);
      this.loadFavoriteMovies();
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.isFavoritesPage = event.urlAfterRedirects.includes('/Myfavorites');
        this.isFavorite = this.favoriteMovies.some(
          (movie) => movie.id === this.film.id
        );
      });
  }

  loadFavoriteMovies() {
    this.filmService.getFavoriteMovies(this.userId).subscribe(
      (movies) => {
        this.favoriteMovies = movies;
        this.isFavorite = this.favoriteMovies.some(
          (movie) => movie.id === this.film.id
        );
      },
      (error) => {
        console.error('Error fetching favorite movies:', error);
      }
    );
  }

  getUrl(name: any) {
    return this.filmService.getImageFromApi(name);
  }

  toggleFavorite() {
    this.isFavorite ? this.removeFromFavorites() : this.addToFavorites();
  }

  addToFavorites() {
    this.isFavorite = true;
    const favoritedata = {
      idfilm: this.film.id,
      favorited: this.isFavorite,
    };

    this.filmService
      .addFavoriteMovie(this.userId, favoritedata.idfilm)
      .subscribe(
        (response) => {
          console.log('Favorite added successfully', response);
          console.log('data is', this.isFavorite, this.film.id);
        },
        (error) => {
          console.error('Error adding favorites', error);
        }
      );
  }

  removeFromFavorites() {
    console.log("I'm called");
    this.isFavorite = false;
    const favoritedata = {
      idfilm: this.film.id,
      favorited: this.isFavorite,
    };

    this.filmService
      .removeFavoriteMovie(this.userId, favoritedata.idfilm)
      .subscribe(
        (response) => {
          console.log('Favorite deleted', response);
          // Emit the event with the ID of the removed movie
          this.favoriteRemoved.emit(this.film.id);
        },
        (error) => {
          console.error('Error deleting favorite', error);
        }
      );
  }
}
