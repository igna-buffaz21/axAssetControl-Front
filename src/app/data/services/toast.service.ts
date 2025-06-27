import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  public toast$ = this.toastSubject.asObservable();

  showSuccess(message: string, duration: number = 3000): void {
    this.show({ message, type: 'success', duration });
  }

  showError(message: string, duration: number = 3000): void {
    this.show({ message, type: 'error', duration });
  }

  showInfo(message: string, duration: number = 3000): void {
    this.show({ message, type: 'info', duration });
  }

  showWarning(message: string, duration: number = 3000): void {
    this.show({ message, type: 'warning', duration });
  }

  private show(toast: Toast): void {
    this.toastSubject.next(toast);
  }
}