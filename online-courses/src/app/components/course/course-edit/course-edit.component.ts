import { Component, Input, OnInit } from '@angular/core';
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
  courseId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private authService: AuthService
  ) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this.courseId = +this.route.snapshot.paramMap.get('id')!;
    this.courseService.getCourseById(this.courseId).subscribe(course => {
      this.courseForm.patchValue(course);
    });
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const token = this.authService.getToken();
      const updates = {
        ...this.courseForm.value,
        teacherId: this.authService.getUser().userId // הוספת teacherId מהמשתמש המחובר
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