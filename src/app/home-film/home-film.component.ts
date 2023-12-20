import {Component, Input} from '@angular/core';
import {Film} from "../../Model/film";
import {FilmService} from "../../Service/film.service";
import {DetailsComponent} from "../details/details.component";
import {RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";


@Component({
  selector: 'app-home-film',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './home-film.component.html',
  styleUrl: './home-film.component.css'
})
export class HomeFilmComponent {
  @Input() film!: Film;
  constructor(private filmService :FilmService) { }
  getUrl(name : any){
    return this.filmService.getimagefromapi(name);
  }

  isFavorite: boolean = false;

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    let favoritedata={
      idfilm:this.film.id,
      favorited:this.isFavorite
    }
    if (this.isFavorite==true){
      console.log("true")
      this.filmService.addFavorite(favoritedata).subscribe(
        (response) => {
          console.log('Comment added successfully', response);
          console.log("data is",this.isFavorite,this.film.id)
        },
        (error) => {
          console.error('Error adding favorites', error);
        })
    }
    else{
      console.log("false")
      this.filmService.deleteFavoriteByIdFilm(this.film.id).subscribe(
        (response) => {
          console.log('Comment deleted', response);
          console.log("data is",this.isFavorite,this.film.id)
        },
        (error) => {
          console.error('Error delleting', error);
        })
    }

  }


}
