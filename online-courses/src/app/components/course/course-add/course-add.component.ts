import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, HttpClientModule]
})
export class CourseAddComponent {
  courseForm: FormGroup;

  constructor(private fb: FormBuilder, private courseService: CourseService, private authService: AuthService) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.courseForm.valid) {
      this.courseService.createCourse(this.courseForm.value, this.authService.getToken()).subscribe(() => {
        // Handle successful course creation
      }, error => {
        // Handle course creation error
        console.error(error);
      });
    }
  }
}