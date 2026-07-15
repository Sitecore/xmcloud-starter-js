import { Component, OnInit } from '@angular/core';
import { SxaComponent } from '../sxa.component';

@Component({
    selector: 'app-partial-design-dynamic-placeholder',
    templateUrl: './partial-design-dynamic-placeholder.component.html',
    standalone: false
})
export class PartialDesignDynamicPlaceholderComponent extends SxaComponent implements OnInit {
  sig: string;
  ngOnInit() {
    super.ngOnInit();

    this.sig = this.rendering.params?.sig || '';
  }
}
