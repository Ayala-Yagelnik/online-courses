import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { Course } from '../../../models/course.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-teacher-courses',
  templateUrl: './teacher-courses.component.html',
  styleUrls: ['./teacher-courses.component.css'],
  standalone: true,
  imports: [MatCardModule, MatButtonModule, RouterModule, HttpClientModule]
})
export class TeacherCoursesComponent implements OnInit {
  courses: Course[] = [];

  constructor(private courseService: CourseService, private authService: AuthService) { }

  ngOnInit(): void {
    this.courseService.getTeacherCourses(this.authService.getToken()).subscribe(courses => {
      this.courses = courses;
    }, error => {
      console.error('Error fetching teacher courses:', error);
    });
  }
}