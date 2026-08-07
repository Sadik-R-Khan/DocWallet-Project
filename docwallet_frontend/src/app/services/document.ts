import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface DocumentData{
  id: number,
  filename:string,
  contentType:string,
  fileSize:number,
  uploadTimestamp:string;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private baseUrl = 'http://localhost:8080/api/documents';

  constructor(private http:HttpClient){}

  getUserDocuments():Observable<DocumentData[]>{
    return this.http.get<DocumentData[]>(this.baseUrl);
  }

  uploadDocument(file:File): Observable<DocumentData>{
    const formData = new FormData();
    formData.append('file',file);
    return this.http.post<DocumentData>(`${this.baseUrl}/upload`, formData);
  }

  downloadDocument(id:number): Observable<Blob>{
    return this.http.get(`${this.baseUrl}/${id}/download`, {responseType:'blob'});
  }

  deleteDocument(id:number): Observable<any>{
    return this.http.delete(`${this.baseUrl}/${id}`,{responseType:'text'});
  }
}
