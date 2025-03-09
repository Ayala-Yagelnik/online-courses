import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Lesson } from '../../../models/lesson.model';
import { LessonService } from '../../../services/lesson.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-lesson-list',
  templateUrl: './lesson-list.component.html',
  imports: [
    MatCardModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule],
  standalone: true,
  styleUrls: ['./lesson-list.component.css']
})
export class LessonListComponent implements OnInit {
  @Input() courseId: number = 0;
  lessons: Lesson[] = [];
  isCourseCreator: boolean = false;

  constructor(
    private lessonService: LessonService,
    private courseService: CourseService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    const currentUser = this.authService.getUser();
    this.lessonService.getLessons(this.courseId).subscribe(lessons => {
      this.lessons = lessons;
    });

    this.courseService.getCourseById(this.courseId).subscribe(course => {
      this.isCourseCreator = course.teacherId === currentUser.id;
    });
  }

}