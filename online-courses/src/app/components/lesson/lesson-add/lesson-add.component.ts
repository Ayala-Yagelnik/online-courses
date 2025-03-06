import { Component, OnInit ,Inject} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LessonService } from '../../../services/lesson.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-lesson-add',
  templateUrl: './lesson-add.component.html',
  styleUrls: ['./lesson-add.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, HttpClientModule]
})
export class LessonAddComponent {
  lessonForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private lessonService: LessonService,
    private authService: AuthService,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<LessonAddComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { courseId: number }
  ) {
    this.lessonForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.lessonForm.valid) {
      this.lessonService.createLesson(this.data.courseId, this.lessonForm.value, this.authService.getToken()).subscribe(() => {
        this.dialogRef.close('added');
      }, error => {
        console.error(error);
      });
    }
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}