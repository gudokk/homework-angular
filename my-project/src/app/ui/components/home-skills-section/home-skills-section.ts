import { Component } from '@angular/core';

@Component({
  selector: 'app-home-skills-section',
  standalone: true,
  templateUrl: './home-skills-section.html',
})
export class HomeSkillsSection {
  protected skills = [
    'JavaScript / TypeScript',
    'React / Angular',
    'Creativity',
    'HTML / CSS',
    'Git / Docker',
    'Team working',
  ];
}
