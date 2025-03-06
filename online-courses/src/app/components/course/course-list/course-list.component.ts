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
import { HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  imports: [
    MatCardModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  standalone: true,
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];

  constructor(
    private courseService: CourseService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.courseService.getCourses().subscribe(courses => {
      this.courses = courses;
      const token = this.authService.getToken();
      const userRequests = courses.map(course => this.userService.getUserById(course.teacherId,token));
      forkJoin(userRequests).subscribe(users => {
        this.courses = courses.map((course, index) => ({
          ...course,
          creatorName: users[index].name
        }));
      });
    }, error => {
      console.error('Error fetching courses:', error);
    });
  }
  getInitials(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }
}