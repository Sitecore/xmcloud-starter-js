import { Component, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
    selector: 'app-content-block',
    templateUrl: './content-block.component.html',
    standalone: false
})
export class ContentBlockComponent {
  @Input() rendering: ComponentRendering;
}
