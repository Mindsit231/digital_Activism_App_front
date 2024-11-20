import {timestamp} from 'rxjs';

export class Community {
  id: number;
  name: string;
  description: string;
  logoName: string;
  bannerName: string;
  ownerId: number;
  timestamp: string;


  constructor(id: number, name: string, description: string, logoName: string, bannerName: string, ownerId: number, timestamp: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.logoName = logoName;
    this.bannerName = bannerName;
    this.ownerId = ownerId;
    this.timestamp = timestamp;
  }
}
