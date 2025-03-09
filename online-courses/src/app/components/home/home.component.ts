import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthDialogComponent } from '../authentication/auth-dialog/auth-dialog.component';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterModule]
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;
  private authSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
  }
  openAuthDialog() {
    if (!this.isLoggedIn) {
      this.dialog.open(AuthDialogComponent);
      this.isLoggedIn = true;
    }
    else{
     //ToDo: ruoting to course-list 
    }
  }
}