import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthDialogComponent } from '../authentication/auth-dialog/auth-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterModule]
})
export class NavbarComponent { 
  constructor(private authService: AuthService, private dialog: MatDialog) {}

  isLoggedIn(): boolean {
    console.log("logged in: "+this.authService.isLoggedIn());
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout(); 
  }
  
  openAuthDialog() {
    this.dialog.open(AuthDialogComponent);
  }
}