import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { UserService } from '../../../services/user.service';
import { Course } from '../../../models/course.model';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  standalone: true,
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  userInitials: { [key: number]: BehaviorSubject<string> } = {};

  constructor(
    private courseService: CourseService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.courseService.getCourses().subscribe(courses => {
      this.courses = courses;
      this.courses.forEach(course => {
        if (!this.userInitials[course.teacherId]) {
          this.userInitials[course.teacherId] = new BehaviorSubject<string>('');
          this.loadUserInitials(course.teacherId);
        }
      });
    });
  }

  loadUserInitials(id: number): void {
    const token = this.authService.getToken();
    this.userService.getUserById(id, token).subscribe(user => {
      const initials = user.name ? user.name : '';
      this.userInitials[id].next(initials);
    });
  }

  getInitials(id: number): BehaviorSubject<string> {
    return this.userInitials[id] || new BehaviorSubject<string>('');
  }
}