import { Component } from '@angular/core';

@Component({
  selector: 'app-home-hobby-section',
  standalone: true,
  templateUrl: './home-hobby-section.html',
})
export class HomeHobbySection {
  protected hobbyImages = [
    'https://picsum.photos/300/400',
    'https://picsum.photos/301/400',
  ];

  protected rightPlaceholders = [1, 2];
}
