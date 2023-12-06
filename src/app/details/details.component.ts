import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Film} from "../../Model/film";
import {FilmService} from "../../Service/film.service";
import {Filmdetails} from "../../Model/filmdetails";
import {Genre} from "../../Model/genre";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit{
  filmdetails!:Filmdetails
  genre!:Genre[]
  constructor(private filmservice:FilmService,private activatedRoute:ActivatedRoute) {
  }
  getPopularMoviesById(){
    this.filmservice.getPopularMoviesById(this.activatedRoute.snapshot.params["id"]).
    subscribe((result)=>{
      this.filmdetails=result
      this.genre=this.filmdetails.genres
      console.log("Filmdetails",this.filmdetails)
      console.log("Genre",this.genre)
    })
  }

  ngOnInit(): void {
    this.getPopularMoviesById()
    console.log(this.activatedRoute.snapshot.params["id"])
  }


}
