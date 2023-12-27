import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Film } from '../Model/film';
import { FilmService } from '../Service/film.service';
import { FilmCardComponent } from '../filmCard/filmCard.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FilmCardComponent, HttpClientModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  films!: Film[];
  filmsfiltred!: Film[];
  all_ids!: number[];
  isFavoritesPage: boolean = false;

  constructor(private filmservice: FilmService, private router: Router) {}

  ngOnInit(): void {
    this.getAllDetails();
    this.filmservice.filteredFilms$.subscribe((filteredFilms) => {
      this.filmsfiltred = filteredFilms;
    });
  }

  getAllDetails() {
    // get all popular movie with all detail aller retour get
    this.filmservice.getPopularMovies().subscribe((data) => {
      this.films = data.results;
      this.filmsfiltred = data.results;
      this.all_ids = this.films.map((film) => film.id);

      // Now that all_ids is defined, you can make the specific API call
      if (this.all_ids.length > 0) {
        const requests = this.all_ids.map((id) =>
          this.filmservice.getMovieById(id)
        );
      }
    });
  }

  getUrl(name: any) {
    return this.filmservice.getImageFromApi(name);
  }

  isFavorite: boolean = false;

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }
}