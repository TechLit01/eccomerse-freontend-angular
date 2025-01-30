
// search.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SearchResult {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = `${environment.apiUrl}/products/search`;

  constructor(private http: HttpClient) {}

  search(query: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(this.apiUrl, {
      params: { q: query }
    });
  }
}

