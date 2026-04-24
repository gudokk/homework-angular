import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-blog-stats-dialog',
  standalone: true,
  templateUrl: './blog-stats-dialog.html',
  styleUrl: './blog-stats-dialog.scss',
})
export class BlogStatsDialog {
  @Input() postsCount: number = 0;      
  @Output() close = new EventEmitter<void>();

  protected onClose(): void {
    this.close.emit();
  }
}