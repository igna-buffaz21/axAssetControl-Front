import { Component } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService } from '../../data/services/toast.service';
import { Toast } from '../../data/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {

  toast: Toast | null = null;
  visible = false;
  showAnimation = true;
  private subscription: Subscription = new Subscription();
  private timeoutId: any;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.toast$.subscribe(toast => {
      this.showToast(toast);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private showToast(toast: Toast): void {
    // Clear any existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    // Set the toast and show it
    this.toast = toast;
    this.visible = true;
    this.showAnimation = true;
    
    // Hide after duration
    this.timeoutId = setTimeout(() => {
      this.hideToast();
    }, toast.duration || 3000);
  }

  private hideToast(): void {
    this.showAnimation = false;
    setTimeout(() => {
      this.visible = false;
    }, 300); // Wait for animation to complete
  }
} 