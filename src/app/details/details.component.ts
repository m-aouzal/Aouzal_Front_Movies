import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilmService } from '../Service/film.service';
import { Filmdetails } from '../Model/filmdetails';
import { Genre } from '../Model/genre';
import { Comment } from '../Model/comment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Editor, NgxEditorModule, Validators } from 'ngx-editor';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, NgxEditorModule, FormsModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  // Properties
  filmdetails!: Filmdetails;
  comments: Comment[];
  filmId!: number;
  genre!: Genre[];

  // Text Editor
  editor!: Editor;
  html: string = 'hello world';
  form = new FormGroup({
    editorContent: new FormControl('', Validators.required()),
  });

  formData: { nom: string; comment: string } = { nom: '', comment: '' };

  // Constructor
  constructor(
    private filmservice: FilmService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  // Lifecycle Hooks
  ngOnInit(): void {
    this.getMovieById();
    this.getComments();
    this.editor = new Editor();
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      this.filmId = id;
    });
    this.filmservice.commentsChanged.subscribe((comments) => {
      if (comments !== null) {
        this.comments = comments;
      }
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  // Methods

  // Comment Submission
  submitComment() {
    const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    const comment: Comment = {
      id: id,
      username: this.formData.nom,
      data: this.formData.comment,
    };

    this.filmservice.addComment(this.filmId, comment).subscribe(
      (response) => {
        console.log('Comment added successfully', response);
        // Refresh comments after adding a new one
        this.getComments();
      },
      (error) => {
        console.error('Error adding comment', error);
      }
    );
  }

  // Editor Submission
  submitEditorContent() {
    const editorContent = this.html;
    console.log('Editor content submitted:');
  }

  // Movie Details
  getMovieById() {
    this.filmservice
      .getMovieById(this.activatedRoute.snapshot.params['id'])
      .subscribe((result) => {
        this.filmdetails = result;
        this.genre = this.filmdetails.genres;
      });
  }

  deleteComment(id: number) {
    this.filmservice.deleteComment(this.filmId, id).subscribe(
      () => {
        console.log('Comment deleted successfully');
        // Refresh comments after deleting one
        this.getComments();
      },
      (error) => {
        console.error('Error deleting comment', error);
      }
    );
  }

  getComments() {
    this.filmservice.getComments(this.filmId).subscribe((result) => {
      console.log(result);
      this.comments = result;
    });
  }

  // Utility
  protected readonly Editor = Editor;

  sanitizeHTML(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
