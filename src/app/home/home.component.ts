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

  genres: string[] = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family',
    'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction',
    'Thriller', 'TV Movie', 'War', 'Western'
  ];

  selectedGenre: string = ''; // Initialize with an empty string or a default genre if needed

  constructor(private filmservice:FilmService) {
  }
  ngOnInit(): void {
    this.getPopularMovies();
  }
  getPopularMovies(){
    this.filmservice.getPopularMovies().subscribe((data)=>{
      this.films=data.results ;
      this.filmsfiltred=data.results
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

  filterResultsGenre(genre:string) {
    /*
    if(!genre){
      this.filmsfiltred=this.films
      console.log(this.films)
      return;
    }
    this.filmsfiltred=this.films.filter(
      film =>film?.title.toLowerCase().includes(genre.toLowerCase())
    )*/
  }
}


