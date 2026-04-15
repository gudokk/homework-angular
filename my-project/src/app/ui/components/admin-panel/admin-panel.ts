import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface Posts {
  id: number;
  title: string;
  text: string;
}

export interface NewPost {
  title: string;
  text: string;
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss',
})
export class AdminPanel {
  @Input() postsCount: number = 0;
  @Output() addPost = new EventEmitter<NewPost>();

  isPostFormOpen = false;
  isStatsOpen = false;

  title = '';
  text = '';

  savePost() {
    const trimmedTitle = this.title.trim();
    const trimmedText = this.text.trim();

    if (!trimmedTitle || !trimmedText) {
      return;
    }

    this.addPost.emit({
      title: trimmedTitle,
      text: trimmedText,
    });

    this.title = '';
    this.text = '';
    this.isPostFormOpen = false;
  }
}