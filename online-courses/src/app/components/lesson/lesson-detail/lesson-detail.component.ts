import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Lesson } from '../../../models/lesson.model';
import { LessonService } from '../../../services/lesson.service';

@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.component.html',
  styleUrls: ['./lesson-detail.component.css']
})
export class LessonDetailComponent implements OnInit {
  lesson: Lesson | undefined;

  constructor(private route: ActivatedRoute, private lessonService: LessonService) { }

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('courseId');
    const id = this.route.snapshot.paramMap.get('id');
    if (courseId && id) {
      this.lessonService.getLessonById(+courseId, +id, 'your-token-here').subscribe(lesson => {
        this.lesson = lesson;
      });
    }
  }
}