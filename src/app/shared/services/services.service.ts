import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface Farm {
  _id?: string; // Optional, for update/delete
  title: string;
  imageUrl: string;
  practiceType: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private baseUrl = 'http://localhost:3000'; // Your NestJS backend URL
  private readonly tokenKey = 'token'; // localStorage key for JWT token

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  // ---------- AUTHENTICATION METHODS ----------
  
  // Save JWT token (used after login or Google OAuth)
  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  // Retrieve JWT token
  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.tokenKey);
  }

  // Remove JWT token on logout
  clearToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  // Check if user is logged in (token exists)
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ---------- BLOGS ----------
  submitBlog(blog: { title: string; content: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/blogs`, blog);
  }

  getAllBlogs(): Observable<any> {
    return this.http.get(`${this.baseUrl}/blogs`);
  }

  getBlogById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/blogs/${id}`);
  }

  updateBlog(id: string, blogData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/blogs/${id}`, blogData);
  }

  deleteBlog(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/blogs/${id}`);
  }

  // ---------- FARMS ----------
  createFarm(farmData: Farm): Observable<Farm> {
    return this.http.post<Farm>(`${this.baseUrl}/farm`, farmData);
  }

  getAllFarms(): Observable<Farm[]> {
    return this.http.get<Farm[]>(`${this.baseUrl}/farm`);
  }

  getFarmById(id: string): Observable<Farm> {
    return this.http.get<Farm>(`${this.baseUrl}/farm/${id}`);
  }

  updateFarm(id: string, farmData: Farm): Observable<Farm> {
    return this.http.patch<Farm>(`${this.baseUrl}/farm/${id}`, farmData);
  }

  deleteFarm(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/farm/${id}`);
  }
}
