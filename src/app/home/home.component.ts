import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Film } from "../../Model/film";
import { FilmService } from "../../Service/film.service";
import {HomeFilmComponent} from "../home-film/home-film.component";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HomeFilmComponent,
    HttpClientModule,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  films!:Film[]
  filmsfiltred!:Film[]
  constructor(private filmservice:FilmService) {
  }
  ngOnInit(): void {
    this.getPopularMovies();
  }
  getPopularMovies(){
    this.filmservice.getPopularMovies().subscribe((result)=>{
      this.films=result.results ;
      this.filmsfiltred=result.results
    })
  }
  getUrl(name : any){
    return this.filmservice.getimagefromapi(name);
  }
  filterResults(text:string){
    if(!text){
      this.filmsfiltred=this.films
      return;
    }
    this.filmsfiltred=this.films.filter(
      film =>film?.title.toLowerCase().includes(text.toLowerCase())
    )
  }
}


