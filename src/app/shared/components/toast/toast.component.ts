import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Toast, ToastService } from '../../../core/services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="fixed top-6 right-6 z-50 flex flex-col gap-3">
      <div
        *ngFor="let toast of toasts"
        [@toastAnimation]
        class="p-4 rounded-lg shadow-lg max-w-xs w-full flex items-center gap-3"
        [ngClass]="{
          'bg-green-600 text-white': toast.type === 'success',
          'bg-red-600 text-white': toast.type === 'error',
          'bg-blue-600 text-white': toast.type === 'info',
          'bg-yellow-500 text-white': toast.type === 'warning'
        }"
      >
        <i
          class="fas text-xl"
          [ngClass]="{
            'fa-check-circle': toast.type === 'success',
            'fa-times-circle': toast.type === 'error',
            'fa-info-circle': toast.type === 'info',
            'fa-exclamation-triangle': toast.type === 'warning'
          }"
        ></i>
        <span class="flex-1">{{ toast.message }}</span>
        <button
          (click)="removeToast(toast.id)"
          class="text-white/80 hover:text-white"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `,
  animations: [
    trigger('toastAnimation', [
      state(
        'void',
        style({
          transform: 'translateX(100%)',
          opacity: 0,
        })
      ),
      transition('void => *', [
        animate(
          '300ms ease-out',
          style({
            transform: 'translateX(0)',
            opacity: 1,
          })
        ),
      ]),
      transition('* => void', [
        animate(
          '300ms ease-in',
          style({
            transform: 'translateX(100%)',
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription: Subscription | null = null;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.toasts.subscribe((toast) => {
      this.toasts.push(toast);

      // Auto-remove toast after duration
      setTimeout(() => {
        this.removeToast(toast.id);
      }, toast.duration);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
}
