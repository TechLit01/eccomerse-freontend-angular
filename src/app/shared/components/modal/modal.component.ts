import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DialogRemoteControl } from '@ng-vibe/dialog';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  dialogRemoteControl: DialogRemoteControl = inject(DialogRemoteControl);
  authService = inject(AuthService);
  router = inject(Router);
  constructor() {
    console.log(this.dialogRemoteControl.payload);
  }

  close(payload?: any): void {
    const data = { payload: payload };
    this.dialogRemoteControl.closeDialog(data);
  }
  reloadPage(currentRoute: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentRoute]);
  }
}
