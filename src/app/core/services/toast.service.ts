import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts$ = new Subject<Toast>();
  private nextId = 0;

  toasts = this.toasts$.asObservable();

  constructor() {}

  /**
   * Show a success toast notification
   */
  success(message: string, duration = 3000): void {
    this.show({
      id: this.getNextId(),
      message,
      type: 'success',
      duration,
    });
  }

  /**
   * Show an error toast notification
   */
  error(message: string, duration = 3000): void {
    this.show({
      id: this.getNextId(),
      message,
      type: 'error',
      duration,
    });
  }

  /**
   * Show an info toast notification
   */
  info(message: string, duration = 3000): void {
    this.show({
      id: this.getNextId(),
      message,
      type: 'info',
      duration,
    });
  }

  /**
   * Show a warning toast notification
   */
  warning(message: string, duration = 3000): void {
    this.show({
      id: this.getNextId(),
      message,
      type: 'warning',
      duration,
    });
  }

  /**
   * Show a toast notification
   */
  private show(toast: Toast): void {
    this.toasts$.next(toast);
  }

  /**
   * Get next unique ID for toast
   */
  private getNextId(): number {
    return this.nextId++;
  }
}
