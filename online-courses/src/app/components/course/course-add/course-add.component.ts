import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators,FormArray } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { LessonService } from '../../../services/lesson.service';
import { AuthService } from '../../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { LessonAddComponent } from "../../lesson/lesson-add/lesson-add.component";
import { MatDialogModule, MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    LessonAddComponent
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ]
})

export class CourseAddComponent {
  courseForm: FormGroup;
  lessons: FormArray;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private courseService: CourseService,
    private lessonService: LessonService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<CourseAddComponent>) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      lessons: this.fb.array([])
    });
    this.lessons = this.courseForm.get('lessons') as FormArray;
  }

  get lessonForms() {
    return this.courseForm.get('lessons') as FormArray;
  }

  addLesson() {
    const lesson = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
    this.lessonForms.push(lesson);
  }

  deleteLesson(i: number) {
    this.lessonForms.removeAt(i);
  }

  onSubmit() {
    if (this.courseForm.valid) {
      this.courseService.createCourse(this.courseForm.value, this.authService.getToken()).subscribe(course => {
        const courseId = course.id;
        const lessons = this.courseForm.value.lessons;
        lessons.forEach((lesson: any) => {
          this.lessonService.createLesson(courseId, lesson, this.authService.getToken()).subscribe();
        });
        this.router.navigate(['/manage-courses'])
      }, error => {
        // Handle course creation error
        console.error(error);
      });
    }
  }
}