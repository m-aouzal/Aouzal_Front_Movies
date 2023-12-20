import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Film } from "../../Model/film";
import { FilmService } from "../../Service/film.service";
import {HomeFilmComponent} from "../home-film/home-film.component";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {Filmdetails} from "../../Model/filmdetails";
import {forkJoin} from "rxjs";



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HomeFilmComponent,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  films!:Film[]
  filmsfiltred!:Film[]
  all_ids!:number[]
  id_gender: any[] = []; // Initialize id_gender as an empty array
  filmdetails!: Filmdetails;


  genres: string[] = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family',
    'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction',
    'Thriller', 'TV Movie', 'War', 'Western'
  ];

  selectedGenre: string = ''; // Initialize with an empty string or a default genre if needed

  constructor(private filmservice:FilmService) {
  }
  ngOnInit(): void {
    this.getAllDatils()
  }
  getAllDatils() { // get all popular movie with all detail aller retour get
    this.filmservice.getPopularMovies().subscribe((data) => {
      this.films = data.results;
      this.filmsfiltred = data.results;
      this.all_ids = this.films.map(film => film.id);

      // Now that all_ids is defined, you can make the specific API call
      if (this.all_ids.length > 0) {
        const requests = this.all_ids.map(id => this.filmservice.getPopularMoviesById(id));

        forkJoin(requests).subscribe((results) => {
          results.forEach((result, index) => {
            this.id_gender.push({ "idfilm": this.all_ids[index], "genres": result.genres });
          });
        });
      }
    });
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
  isFavorite: boolean = false;

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  filterResultsGenre(genre:string) {
    console.log(genre)
    console.log("zlk",this.id_gender)

    if (!genre) {
      this.filmsfiltred = this.films;  // If no genre is selected, display all films
      return;
    }

    const matchingIds = this.id_gender
      .filter((entry: any) => entry.genres.some((genreObj: any) => genreObj.name.toLowerCase() === genre.toLowerCase()))
      .map((entry: { idfilm: number }) => entry.idfilm);

    console.log("matchingid", matchingIds);


    this.filmsfiltred = this.films
      .filter((film) => matchingIds.includes(film.id));

    console.log("Filtered films:", this.filmsfiltred);

  }
}


