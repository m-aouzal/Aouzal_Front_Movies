import { Component, OnInit } from '@angular/core';
import { FilmService } from '../Service/film.service';
import { FavoritedMovie } from '../Model/FavoritedMovie';
import { CommonModule } from '@angular/common';
import { Film } from '../Model/film';
import { forkJoin } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-MyFavorites',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './MyFavorites.component.html',
  styleUrls: ['./MyFavorites.component.css'],
})
export class MyFavoritesComponent implements OnInit {
  favoritedMovies!: FavoritedMovie[];
  favoritedMovieDetailsList: Film[] = [];

  constructor(private filmservice: FilmService) {}

  ngOnInit(): void {
    //   this.getAllFavoritesWithDetails();
  }
  // getUrl(name: any) {
  //   return this.filmservice.getimagefromapi(name);
  // }

  // getAllFavoritesWithDetails() {
  //   this.filmservice.getAllFavorites().subscribe((data) => {
  //     this.favoritedMovies = data;
  //     console.log('data', data);

  //     // Use forkJoin to parallelize requests
  //     const requests = this.favoritedMovies
  //       .filter((favoritedMovie) => favoritedMovie.idfilm) // Filter out items with missing or falsy idfilm
  //       .map((favoritedMovie) =>
  //         this.filmservice.getPopularMoviesById(favoritedMovie.idfilm)
  //       );

  //     forkJoin(requests).subscribe((results) => {
  //       this.favoritedMovieDetailsList = results.filter((result) => !!result);
  //       console.log('Favorited movie details:', results);
  //     });
  //   });
  // }
}
