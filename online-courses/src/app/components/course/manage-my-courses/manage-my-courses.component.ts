import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { Course } from '../../../models/course.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CourseDetailComponent } from '../course-detail/course-detail.component';

@Component({
  selector: 'app-manage-my-courses',
  templateUrl: './manage-my-courses.component.html',
  styleUrls: ['./manage-my-courses.component.css'],
  standalone: true,
  imports: [MatCardModule,CourseDetailComponent, MatButtonModule, RouterModule]
})
export class ManageMyCoursesComponent implements OnInit {
  courses: Course[] = [];

  constructor(private courseService: CourseService, private authService: AuthService) { }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.id) {
      this.courseService.getCourses().subscribe({     
        next: (courses) => {
          console.log(courses);
          this.courses = courses.filter(course => course.teacherId === user.id);
          console.log(this.courses);
        },
        error: (error) => {
          console.error('Error fetching courses:', error);
        }
      });
    }
  }

  deleteCourse(courseId: number): void {
    this.courseService.deleteCourse(courseId, this.authService.getToken()).subscribe({
      next: () => {
        this.courses = this.courses.filter(course => course.id !== courseId);
      },
      error: (error) => {
        console.error('Error deleting course:', error);
      }
    });
  }
}