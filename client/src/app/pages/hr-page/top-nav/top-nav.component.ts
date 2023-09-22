import { Component } from '@angular/core';

// handle the logout function
// import { AuthService } from '../auth.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.sass']
})
export class TopNavComponent {
  //constructor(private authService: AuthService) { }

  logout() {
    alert('You logout! Just kidding :D')
    //this.authService.logout();
  }
}
