import { Component } from '@angular/core';

type Job = {
  date: string;
  title: string;
  description: string;
};

@Component({
  selector: 'app-home-work-section',
  standalone: true,
  templateUrl: './home-work-section.html',
})
export class HomeWorkSection {
  protected jobs: Job[] = [
    {
      date: '2023 – 2024',
      title: 'Преподаватель математики',
      description: 'Подготовка школьников к олимпиадам',
    },
    {
      date: '2025',
      title: 'Frontend стажер (React)',
      description: 'Разработка страниц сайта',
    },
    {
      date: '2025 – 2026',
      title: 'Frontend (Angular)',
      description: 'Доработка корпоративного сайта',
    },
  ];
}
