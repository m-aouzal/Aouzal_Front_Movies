import {Component, Input} from '@angular/core';
import {Film} from "../../Model/film";
import {FilmService} from "../../Service/film.service";
import {DetailsComponent} from "../details/details.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home-film',
  standalone: true,
  imports: [
    RouterLink
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


}
