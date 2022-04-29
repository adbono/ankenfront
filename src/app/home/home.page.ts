import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MenuLoginComponent } from './menu-login/menu-login.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  popover = false

  constructor(
    public popoverController: PopoverController    
    ) {}

    async presentPopover(ev: any) {
      const popover = await this.popoverController.create({
        component: MenuLoginComponent,
        event: ev,
        translucent: true
      });
      return await popover.present();
    }
}
