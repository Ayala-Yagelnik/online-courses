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
import { Lesson } from '../../../models/lesson.model';

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
  deletedLessons: number[] = [];

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
        if (Array.isArray(lessons)) {
          lessons.forEach((lesson: any) => {
            this.addExistingLesson(lesson);
          });
        } else {
          console.error('Lessons is not an array:', lessons);
        }
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

  deleteLesson(i: number, event: Event) {
    event.preventDefault();
    const lessonId = this.lessonForms.at(i).get('id')?.value;
    if (lessonId) {
      this.deletedLessons.push(lessonId);
    }
    this.lessonForms.removeAt(i);
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
          console.log('lessons', lessons);
          lessons.forEach((lesson: Lesson) => {
            if (lesson.id) {
              console.log('updating lesson', lesson.id);
              this.lessonService.updateLesson(this.courseId, lesson.id, lesson, token).subscribe({
                error: (err) => {
                  console.error(`Error updating lesson ${lesson.id}:`, err);
                }
              });
            } else {
              console.log('creating lesson');
              this.lessonService.createLesson(this.courseId, lesson, token).subscribe({
                error: (err) => {
                  console.error(`Error creating lesson:`, err);
                }
              });
            }
          });
          this.deletedLessons.forEach(lessonId => {
            this.lessonService.deleteLesson(this.courseId, lessonId, token).subscribe({
              error: (err) => {
                console.error(`Error deleting lesson ${lessonId}:`, err);
              }
            });
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