import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiBaseService {
  protected readonly http = inject(HttpClient);
  protected readonly apiUrl = environment.apiUrl;

  protected get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http
      .get<T>(`${this.apiUrl}${path}`, { params })
      .pipe(timeout({ each: environment.timeout }));
  }

  protected post<TRequest, TResponse>(
    path: string,
    body: TRequest,
    headers?: HttpHeaders
  ): Observable<TResponse> {
    return this.http
      .post<TResponse>(`${this.apiUrl}${path}`, body, { headers })
      .pipe(timeout({ each: environment.timeout }));
  }

  protected put<TRequest, TResponse>(path: string, body: TRequest): Observable<TResponse> {
    return this.http
      .put<TResponse>(`${this.apiUrl}${path}`, body)
      .pipe(timeout({ each: environment.timeout }));
  }

  protected delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${path}`).pipe(timeout({ each: environment.timeout }));
  }
}
