import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Film} from "../../Model/film";
import {FilmService} from "../../Service/film.service";
import {Filmdetails} from "../../Model/filmdetails";

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit{
  filmdetails!:Filmdetails
  constructor(private filmservice:FilmService,private activatedRoute:ActivatedRoute) {
  }
  getPopularMoviesById(){
    this.filmservice.getPopularMoviesById(this.activatedRoute.snapshot.params["id"]).
    subscribe((result)=>{
      this.filmdetails=result
      console.log("Result",this.filmdetails)
    })
  }

  ngOnInit(): void {
    this.getPopularMoviesById()
    console.log(this.activatedRoute.snapshot.params["id"])
  }


}
