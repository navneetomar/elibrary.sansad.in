import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UltiService } from '../../core/services/ulti.service';
import { switchMap, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ds-community-collections',
  templateUrl: './community-collections.component.html',
  styleUrls: ['./community-collections.component.scss']
})
export class CommunityCollectionsComponent implements OnInit {
  @Input() collection_id: string = '';

  collectionByComm: any[] = [];  // ✅ Full collection list
  paginatedCollections: any[] = []; // ✅ Displayed items per page
  currentPage: number = 1; // ✅ Pagination current page
  pageSize: number = 5; // ✅ Items per page
  totalItems: number = 0; // ✅ Total collections count
  loading: boolean = false; // ✅ Loading state

  constructor(private ultiService: UltiService, private router: Router) {}

  ngOnInit(): void {
    if (this.collection_id) { 
      this.getCollectionsByCommunityId(this.collection_id);
    }
  }

  // ✅ Fetch collections with images and pagination
  getCollectionsByCommunityId(id: string) {
    this.loading = true;
    this.ultiService.getCollectionsByCommunityId(id).pipe(
      switchMap((data) => {
        if (data?._embedded?.collections?.length > 0) {
          this.totalItems = data._embedded.collections.length; // ✅ Total collections count

          const requests = data._embedded.collections.map(item => {
            return this.getLogo(item._links['logo']?.href).pipe(
              map(logo => {
                item.img = logo?._links?.content?.href || 'assets/images/cover_book_enhira.png';
                return item;
              })
            );
          });

          return forkJoin(requests);
        } else {
          return of([]);
        }
      })
    ).subscribe(
      (collectionByComm: any[]) => {
        this.collectionByComm = collectionByComm;
        this.updatePagination(); // ✅ Update page data
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  // ✅ Fetch logo for each collection
  getLogo(logoUrl: string) {
    if (logoUrl) {
      return this.ultiService.getLogoByUrl(logoUrl);
    }
    return of(null);
  }

  // ✅ Handle page change
  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.updatePagination();
  }

  // ✅ Update paginated data on page change
  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedCollections = this.collectionByComm.slice(startIndex, startIndex + this.pageSize);
  }

    // ✅ Redirect to Collection Detail Page
  goToCollection(collectionId: string) {
    this.router.navigate(['/collections', collectionId]);
  }
}
