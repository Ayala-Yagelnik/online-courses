import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Course } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  imports: [RouterModule],
  standalone: true,
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  course: Course | undefined;

  constructor(
    private route: ActivatedRoute,
     private courseService: CourseService,
     private authService: AuthService
    ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const token = this.authService.getToken();
    if (id && token) {
      this.courseService.getCourseById(+id, token).subscribe(course => {
        this.course = course;
      }, error => {
        console.error('Error fetching course details:', error);
      });
    }
  }
}