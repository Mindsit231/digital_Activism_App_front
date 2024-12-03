import {Component, OnInit} from '@angular/core';
import {InternalObjectService} from '../../service/misc/internal-object.service';
import {CommunityDTO} from '../../model/community-dto';
import {StorageKeys} from '../misc/storage-keys';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss'
})
export class CommunityComponent implements OnInit {

  communityDTO!: CommunityDTO;

  constructor(private internalObjectService: InternalObjectService<CommunityDTO>,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.communityDTO = this.internalObjectService.getObject();
    if(this.communityDTO == null) {
    }
    console.log(this.communityDTO);
  }


}
