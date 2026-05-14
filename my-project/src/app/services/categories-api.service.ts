import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CategoryApiDto } from '../dto/article-api';

@Injectable({
  providedIn: 'root',
})
export class CategoriesApiService {
  private readonly base = '/api/categories';

  constructor(private readonly http: HttpClient) {}

  public getAll(): Observable<CategoryApiDto[]> {
    return this.http.get<CategoryApiDto[]>(this.base);
  }

  public create(name: string): Observable<CategoryApiDto> {
    return this.http.post<CategoryApiDto>(this.base, { name: name.trim() });
  }

  public findIdByName(categories: CategoryApiDto[], name: string): string | undefined {
    const target = name.trim().toLowerCase();
    const found = categories.find((c) => c.name.trim().toLowerCase() === target);
    return found?.id;
  }

  public getNames(categories: CategoryApiDto[]): string[] {
    return [...new Set(categories.map((c) => c.name).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, 'ru'),
    );
  }
}
