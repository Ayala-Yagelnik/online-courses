import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { LessonListComponent } from "../../lesson/lesson-list/lesson-list.component";
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service';

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
  isEnrolled: boolean = false;
  teacherName: string = '';

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const token = this.authService.getToken();
    this.isLoggedIn = !!token;
    if (id) {
      this.courseService.getCourseById(+id).subscribe(course => {
        this.course = course;
        this.getTeacherName(course.teacherId);
        this.checkEnrollment(+id);
      }, error => {
        console.error('Error fetching course details:', error);
      });
    }
  }

  getTeacherName(id: number) {
    return this.userService.getUserById(id, this.authService.getToken()).subscribe(user => {
     this.teacherName = user.name;
    }, error => {
      console.error('Error fetching teacher name:', error)
    });
  }

  checkEnrollment(courseId: number): void {
    const userId = this.authService.getUser().userId;
    this.courseService.getCoursesByStudentId(userId, this.authService.getToken()).subscribe(courses => {
      courses.forEach(course => {
        if(course.id === courseId) {
          this.isEnrolled = true;
        }
      });
    });
  }
     
  

  enroll(courseId: number): void {
    const token = this.authService.getToken();
    const userId = this.authService.getUser().userId;

    this.courseService.enrollInCourse(courseId, userId, token).subscribe(() => {
      Swal.fire({
        title: "Enrolled in course successfully",
        icon: "success",
        draggable: false
      });
    }, error => {
      Swal.fire({
        title: "Error enrolling in course",
        icon: "error",
        draggable: false
      });
      console.error('Error enrolling in course:', error);
    });
  }

}