import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { LessonService } from '../../../services/lesson.service';

@Component({
  selector: 'app-course-edit',
  standalone: true,
  imports: [
    MatIconModule,
    MatCardModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.css']
})
export class CourseEditComponent implements OnInit {
  courseForm: FormGroup;
  lessons!: FormArray;
  courseId!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private lessonService: LessonService,
    private authService: AuthService
  ) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      lessons: this.fb.array([])
    });
    this.lessons = this.courseForm.get('lessons') as FormArray;
  }

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.courseService.getCourseById(this.courseId).subscribe(course => {
      this.courseForm.patchValue({
        title: course.title,
        description: course.description
      });
      this.lessonService.getLessons(this.courseId).subscribe(lessons => {
        lessons.forEach((lesson: any) => {
          this.addExistingLesson(lesson);
        });
      });
    });
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

  addExistingLesson(lesson: any) {
    const lessonForm = this.fb.group({
      id: [lesson.id],
      title: [lesson.title, Validators.required],
      content: [lesson.content, Validators.required]
    });
    this.lessonForms.push(lessonForm);
  }

  deleteLesson(i: number) {
    const lessonId = this.lessonForms.at(i).get('id')?.value;
    if (lessonId) {
      const token = this.authService.getToken();
      this.lessonService.deleteLesson(this.courseId, lessonId, token).subscribe(() => {
        this.lessonForms.removeAt(i);
      });
    } else {
      this.lessonForms.removeAt(i);
    }
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const token = this.authService.getToken();
      const updates = {
        ...this.courseForm.value,
        teacherId: this.authService.getUser().userId 
      };
      this.courseService.updateCourse(this.courseId, updates, token).subscribe({
        next: () => {
          const lessons = this.courseForm.value.lessons;
          lessons.forEach((lesson: any) => {
            if (lesson.id) {
              this.lessonService.updateLesson(this.courseId, lesson.id, lesson, token).subscribe();
            } else {
              this.lessonService.createLesson(this.courseId, lesson, token).subscribe();
            }
          });
          Swal.fire({
            title: "The changes saved!",
            icon: "success",
            draggable: false
          });
          this.router.navigate(['/manage-courses']);
        },
        error: (err) => {
          console.error('Error updating course:', err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!"
          });
        }
      });
    }
  }
}