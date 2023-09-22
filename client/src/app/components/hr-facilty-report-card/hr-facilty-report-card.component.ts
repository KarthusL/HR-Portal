import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { tap, throwError, catchError, Observable } from 'rxjs';
import { HousingService } from 'src/app/services/housing.service';
import { Housing } from 'src/app/models/housing.interface';
import { showHouseDetails } from 'src/app/store/actions/hr-housing.actions';
@Component({
  selector: 'app-hr-facilty-report-card',
  templateUrl: './hr-facilty-report-card.component.html',
  styleUrls: ['./hr-facilty-report-card.component.sass']
})
export class HrFaciltyReportCardComponent {
  @Input() reports!: any[];
  @Input() user!: any;
  @Input() house!: Housing;
  editMode: string = '';
  editedComment: string = '';
  addComment: string = '';
  currentPage = 1;
  pageSize = 3;

  constructor(private store: Store, private http: HttpClient, private housingService: HousingService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if ('reports' in changes) {
      this.currentPage = 1;
    }
  }

  get paginatedReports() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.reports.slice(startIndex, endIndex);
  }

  get totalPages() {
    return Math.ceil(this.reports.length / this.pageSize);
  }

  getPaginationArray() {
    return Array(this.totalPages).fill(0).map((zero, idx) => idx + 1);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  toggleEditMode(id: string) {
    this.editMode = id;
  }

  saveComment(commentId: string, reportId: string) {
    this.http.put<{message: string}>('api/housing/update_comment_on_report', {
      commentId,
      reportId,
      houseId: this.house._id,
      desc: this.editedComment,
      ts: new Date()
    })
    .pipe(
      tap(response => {
        console.log(response)
        if (response.message === 'Comment updated successfully') {
          if (this.user.role === 'hr') {
            this.housingService.updateHousesState()
            .then(() => {
              this.store.dispatch(showHouseDetails({ houseId: this.house._id }));
              this.cdr.detectChanges();
              this.editedComment = '';
            })
            .catch(err => {
              console.error(err);
              return;
            })
          }
          if (this.user.role === 'normal') {
            this.housingService.updateEmployeeHouse();
          }
        }
      }),
      catchError(error => {
        console.error('Error occured:', error);
        return throwError(() => error)
      })
    )
    .subscribe();
    this.editMode = '';
  }

  onChange(event: Event, reportId: string, currentStatus: string) {
    const value = (event.target as HTMLSelectElement).value;

    if (value !== 'Change Report Status' && value !== currentStatus) {
      this.http.put<{message: string}>('api/hr/house', {
        housing_id: this.house._id,
        report_id: reportId,
        status: value
      })
      .pipe(
        tap(response => {
          console.log(response)
          if (response.message === 'Report status updated') {
            this.housingService.updateHousesState()
          .then(() => {
            this.store.dispatch(showHouseDetails({ houseId: this.house._id }));
            this.cdr.detectChanges();
          })
          .catch(err => {
            console.error(err);
            return;
          })
          }
        }),
        catchError(error => {
          console.error('Error occured:', error);
          return throwError(() => error)
        })
      )
      .subscribe();
    }
  }

  postComment(reportId: string) {
    this.http.post<{message: string, comment: any}>('api/housing/add_comment_to_report', {
      houseId: this.house._id,
      reportId: reportId,
      desc: this.addComment,
      ts: new Date()
    })
    .pipe(
      tap(response => {
        console.log(response)
        if (response.message === 'New comment added successfully') {
          this.addComment = '';
          if (this.user.role === 'hr') {
            this.housingService.updateHousesState()
            .then(() => {
              this.store.dispatch(showHouseDetails({ houseId: this.house._id }));
              this.cdr.detectChanges();
            })
            .catch(err => {
              console.error(err);
              return;
            })
          }
          if (this.user.role === 'normal') {
            this.housingService.updateEmployeeHouse();
          }
        }
      }),
      catchError(error => {
        console.error('Error occured:', error);
        return throwError(() => error)
      })
    )
    .subscribe();
  }
}
