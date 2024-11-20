import {Component} from '@angular/core';
import {exploreCommunities} from "../header/navigation-item";
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Community} from '../../model/Community';

@Component({
  selector: 'app-explore-communities',
  standalone: true,
  imports: [
    FaIconComponent,
    NgForOf,
    FormsModule
  ],
  templateUrl: './explore-communities.component.html',
  styleUrl: './explore-communities.component.scss'
})
export class ExploreCommunitiesComponent {

  protected readonly exploreCommunities = exploreCommunities;
  searchString: string = "";


  getCommunities(): Community[] {
    return [];
  }
}
