// src/app/services/collection.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private apiUrl = 'http://localhost:8080/server/api/discover/search/objects';

  constructor(private http: HttpClient) {}

  // Method to fetch the total number of items (totalElements) for the collection
  getTotalItemsInCollection(collectionId: string): Observable<any> {
    const url = `${this.apiUrl}?scope=${collectionId}&dsoType=ITEM&size=200&page=0`; // Dynamically append collectionId
    return this.http.get(url);
  }
}
