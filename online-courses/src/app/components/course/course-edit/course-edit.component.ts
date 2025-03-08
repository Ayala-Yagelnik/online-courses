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
    this.courseService.getCourseById(this.courseId).subscribe(course => {
      this.courseForm.patchValue(course);
      this.lessonService.getLessons(this.courseId).subscribe(lesson => {
        this.addExistingLesson(lesson);
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
      title: [lesson.title, Validators.required],
      content: [lesson.content, Validators.required]
    });
    this.lessonForms.push(lessonForm);
  }

  deleteLesson(i: number) {
    this.lessonForms.removeAt(i);
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const token = this.authService.getToken();
      const updates = {
        ...this.courseForm.value,
        teacherId: this.authService.getUser().userId 
      };
      console.log(updates)
      this.courseService.updateCourse(this.courseId, updates, token).subscribe({
        next: () => this.router.navigate(['/manage-courses']),
        error: (err) => {
          if (err.status !== 404) {
            console.error('Error updating course:', err);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!"
            });
          }
          else {
            Swal.fire({
              title: "the changes saved!",
              icon: "success",
              draggable: false
            });
          }
          this.router.navigate(['/manage-courses'])
        }
      });
    }
  }
}