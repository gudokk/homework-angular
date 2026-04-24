import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss',
})
export class AdminPanel {
  @Output() addPostClick = new EventEmitter<void>();
  @Output() statsClick = new EventEmitter<void>();

  protected openPostForm(): void {
    this.addPostClick.emit();
  }

  protected openStats(): void {
    this.statsClick.emit();
  }
}