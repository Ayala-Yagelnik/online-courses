import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { LessonListComponent } from "../../lesson/lesson-list/lesson-list.component";

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  standalone: true,
  styleUrls: ['./course-detail.component.css'],
  imports: [LessonListComponent]
})
export class CourseDetailComponent implements OnInit {
  course: Course | undefined;
  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const token = this.authService.getToken();
    this.isLoggedIn = !!token;
    if (id) {
      this.courseService.getCourseById(+id).subscribe(course => {
        this.course = course;
      }, error => {
        console.error('Error fetching course details:', error);
      });
    }
  }



  enroll(courseId: number): void {
    const token = this.authService.getToken();
    const userId = this.authService.getUser().userId;

    this.courseService.enrollInCourse(courseId, userId, token).subscribe(() => {
      console.log('Enrolled in course successfully');
      // Refresh the course list or update the UI as needed
    }, error => {
      console.error('Error enrolling in course:', error);
    });
  }

}