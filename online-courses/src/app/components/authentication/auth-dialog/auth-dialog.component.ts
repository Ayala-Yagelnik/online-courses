import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from "../login/login.component";
import { MatTabsModule } from '@angular/material/tabs';
import { RegisterComponent } from "../register/register.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [LoginComponent,
    RegisterComponent,
    MatTabsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.css'
})
export class AuthDialogComponent {
  constructor(public dialogRef: MatDialogRef<AuthDialogComponent>) { }

  closeDialog() {
    this.dialogRef.close();
  }
}
