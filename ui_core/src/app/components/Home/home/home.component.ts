import { Component } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  constructor(private overlay: Overlay) { }

  onSpinner() {
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
  }

  offSpinner() {
    this.overlayRef.detach();
  }
}
