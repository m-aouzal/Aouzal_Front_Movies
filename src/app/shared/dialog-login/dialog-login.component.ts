import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-dialog-login',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './dialog-login.component.html',
  styleUrl: './dialog-login.component.css',
})
export class DialogLoginComponent {}
