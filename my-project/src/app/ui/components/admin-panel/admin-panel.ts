import { Component, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
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