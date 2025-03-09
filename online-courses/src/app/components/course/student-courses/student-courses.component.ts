import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course.model';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-courses',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './student-courses.component.html',
  styleUrls: ['./student-courses.component.css']
})
export class StudentCoursesComponent implements OnInit {
  courses: Course[] = [];

  constructor(private authService: AuthService, private courseService: CourseService) { }

  ngOnInit(): void {
    const token = this.authService.getToken();
    const userId = this.authService.getUser().userId;

    this.courseService.getCoursesByStudentId(userId, token).subscribe(courses => {
      this.courses = courses;
    }, error => {
      console.error('Error fetching student courses:', error);
    });
  }

  unenroll(courseId: number): void {
    const token = this.authService.getToken();
    const userId = this.authService.getUser().userId;

    this.courseService.unenrollFromCourse(courseId, userId, token).subscribe(() => {
      Swal.fire({
        title: "Unenrolled from course successfully",
        icon: "success",
        draggable: false
      });
      this.courseService.getCoursesByStudentId(userId, token).subscribe(courses => {
        this.courses = courses;
      }, error => {
        Swal.fire({
          title: "Error fetching student courses",
          icon: "error",
          draggable: false
        });
      });
    }, error => {  
      Swal.fire({
        title: 'Error unenrolling from course:',
        icon: "error",
        draggable: false
      });
    });
  }
}