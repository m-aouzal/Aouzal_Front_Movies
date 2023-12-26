import { Component, Input, OnInit } from '@angular/core';
import { Film } from '../Model/film';
import { FilmService } from '../Service/film.service';
import { DetailsComponent } from '../details/details.component';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsersloginService } from '../Service/users.login.service';
import { User } from '../login/user.model';
import { from } from 'rxjs';
@Component({
  selector: 'app-home-film',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  providers: [FilmService],
  templateUrl: './home-film.component.html',
  styleUrl: './home-film.component.css',
})
export class HomeFilmComponent implements OnInit {
  @Input() film!: Film;
  user: User;
  constructor(
    private filmService: FilmService,
    private usersLoginService: UsersloginService
  ) {}

  ngOnInit(): void {
    this.usersLoginService.userSubject.subscribe((user) => {
      this.user = user;
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
      this.filmService.addToFavorites(this.film.id, this.user.id).subscribe(
        (response) => {
          console.log('Comment added successfully', response);
          console.log('data is', this.isFavorite, this.film.id);
        },
        (error) => {
          console.error('Error adding favorites', error);
        }
      );
    } else {
      console.log('false');
      from(
        this.filmService.removeFromFavorites(this.film.id, this.user.id)
      ).subscribe(
        (response) => {
          console.log('Comment deleted', response);
          console.log('data is', this.isFavorite, this.film.id);
        },
        (error) => {
          console.error('Error deleting', error);
        }
      );
    }
  }
}
