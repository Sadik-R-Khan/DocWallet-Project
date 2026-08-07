import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DocumentService,DocumentData } from '../../services/document';
import { AuthService } from '../../services/auth';
import { finalize, Observable, tap, timeout } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  documents: DocumentData[] =[];
  selectedFile: File | null = null;
  isUploading: boolean = false;
  isDeleting: boolean = false;
  isDocumentsLoading: boolean = false;
  message: string ='';
  errormessage: string ='';

  constructor(
    private documentService: DocumentService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void{
    this.loadDocuments();
  }

  get isLoading(): boolean {
    return this.isUploading || this.isDeleting;
  }

  loadDocuments():void{
    this.isDocumentsLoading = true;
    this.refreshDocuments()
      .pipe(
        timeout(8000),
        finalize(() => {
          this.isDocumentsLoading = false;
          this.refreshView();
        })
      )
      .subscribe({
      error:(err)=>{
        this.isDocumentsLoading = false;
        this.errormessage='Failed to load documents. ' + this.getErrorMessage(err);
        console.log(err);
        this.refreshView();
      }
    });
  }

  private refreshDocuments(): Observable<DocumentData[]> {
    return this.documentService.getUserDocuments().pipe(
      tap((data: DocumentData[]) => {
        this.documents = data || [];
        this.refreshView();
      })
    );
  }

  // State variables for sorting
  sortColumn: keyof DocumentData | '' = '';
  sortAscending: boolean = true;

  /**
   * Sorts the documents array dynamically based on the clicked column.
   */
  sortTable(column: keyof DocumentData): void {
    // If clicking the same column, toggle the direction. Otherwise, sort ascending.
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }

    this.documents.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];

      // Handle string comparison (Filename, Content Type)
      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortAscending 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }

      // Handle number/date comparison (Size, Upload Date)
      if (valA < valB) return this.sortAscending ? -1 : 1;
      if (valA > valB) return this.sortAscending ? 1 : -1;
      return 0;
    });
  }

  onFileSelected(event: Event): void{
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length>0){
      this.selectedFile=input.files[0];
      this.message='';
      this.errormessage='';
      this.refreshView();
    } else {
      this.selectedFile = null;
      this.refreshView();
    }
  }

  onUpload():void{
    if(!this.selectedFile) return;

    this.isUploading = true;
    this.message = '';
    this.errormessage = '';
    this.refreshView();
    const fileToUpload = this.selectedFile;

    this.documentService.uploadDocument(fileToUpload)
      .pipe(
        timeout(30000),
        finalize(() => {
          this.isUploading = false;
          this.refreshView();
        })
      )
      .subscribe({
      next:(document: DocumentData) =>{
        this.isUploading = false;
        this.documents = [document, ...this.documents.filter((doc) => doc.id !== document.id)];
        this.message='File secured and uploaded successfully';
        this.selectedFile= null;
        if(this.fileInput?.nativeElement){
          this.fileInput.nativeElement.value = '';
        }
        this.refreshView();
      },
      error:(err)=>{
        this.isUploading = false;
        this.errormessage = 'Failed to upload file. ' + this.getErrorMessage(err);
        this.refreshView();
      }
    });
  }

  
  onDownload(id:number, filename:string):void{
    this.documentService.downloadDocument(id).subscribe({
      next:(blob:Blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl)
      },
      error:(err)=>{
        this.errormessage = 'Failed to download document. ' + this.getErrorMessage(err);
        this.refreshView();
      }
    });
  } 

  onDelete(id:number): void{
    if(confirm('Are you sure you want to permanantly delete this document?')){
      this.isDeleting = true;
      this.message = '';
      this.errormessage = '';
      this.refreshView();
      this.documentService.deleteDocument(id)
        .pipe(finalize(() => {
          this.isDeleting = false;
          this.refreshView();
        }))
      .subscribe({
        next:()=>{
          this.isDeleting = false;
          this.documents = this.documents.filter((doc) => doc.id !== id);
          this.message="Document deleted successfully.";
          this.errormessage='';
          this.refreshView();

        },
        error:(err)=>{
          this.isDeleting = false;
          this.errormessage ="Failed to delete document. " + this.getErrorMessage(err);
          this.refreshView();
        }
      })
    }
  }
  formatBytes(bytes:number):string{
    if(bytes == 0) return '0 Bytes';
    const k = 1024;
    const size = ['Bytes','KB','MB','GB'];
    const i = Math.floor(Math.log(bytes)/ Math.log(k));
    return parseFloat((bytes/Math.pow(k,i)).toFixed(2))+''+size[i];
  }


  logOut():void{
    this.authService.logout();
  }

  private getErrorMessage(err: any): string {
    const error = err?.error;

    if (typeof error === 'string') {
      return error;
    }

    if (typeof error?.message === 'string') {
      return error.message;
    }

    if (error?.Errors) {
      return Object.values(error.Errors).join(' ');
    }

    if (err?.name === 'TimeoutError') {
      return 'The server took too long to respond. Please try again.';
    }

    return 'Please try again.';
  }

  private refreshView(): void {
    this.cdr.detectChanges();
  }
}
