import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error' | 'info';
  text: string;
  timeout?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toast$ = new Subject<ToastMessage>();
  public onToast = this.toast$.asObservable();

  show(text: string, type: ToastMessage['type'] = 'info', timeout = 4000) {
    this.toast$.next({ text, type, timeout });
  }

  success(text: string, timeout = 4000) {
    this.show(text, 'success', timeout);
  }

  error(text: string, timeout = 6000) {
    this.show(text, 'error', timeout);
  }

  info(text: string, timeout = 4000) {
    this.show(text, 'info', timeout);
  }
}
