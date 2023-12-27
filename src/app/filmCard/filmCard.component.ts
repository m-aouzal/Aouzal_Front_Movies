import { Component, Input, OnInit } from '@angular/core';
import { Film } from '../Model/film';
import { FilmService } from '../Service/film.service';
import { DetailsComponent } from '../details/details.component';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsersloginService } from '../Service/users.login.service';
import { User } from '../login/user.model';
import { HashService } from '../Service/hash.service';

@Component({
  selector: 'app-film-card',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './filmCard.component.html',
  styleUrl: './filmCard.component.css',
})
export class FilmCardComponent implements OnInit {
  @Input() film!: Film;
  user: User;
  userId: number;
  constructor(
    private filmService: FilmService,
    private usersService: UsersloginService,
    private hash: HashService
  ) {}
  ngOnInit(): void {
    this.usersService.userSubject.subscribe((user) => {
      this.user = user;
      this.userId = this.hash.hashCode(this.user.email);
    });
  }

  getUrl(name: any) {
    return this.filmService.getImageFromApi(name);
  }

  isFavorite: boolean = false;

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    let favoritedata = {
      idfilm: this.film.id,
      favorited: this.isFavorite,
    };
    if (this.isFavorite == true) {
      console.log('true');
      this.filmService
        .addFavoriteMovie(this.userId, favoritedata.idfilm)
        .subscribe(
          (response) => {
            console.log('favorite added successfully', response);
            console.log('data is', this.isFavorite, this.film.id);
          },
          (error) => {
            console.error('Error adding favorites', error);
          }
        );
    } else {
      console.log('false');
      this.filmService.removeFavoriteMovie(this.userId, this.film.id).subscribe(
        (response) => {
          console.log('favorite deleted', response);
          console.log('data is', this.isFavorite, this.film.id);
        },
        (error) => {
          console.error('Error delleting', error);
        }
      );
    }
  }
}
