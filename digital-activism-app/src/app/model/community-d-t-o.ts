export class CommunityDTO {
  name: string;
  description: string;
  logoName: string;
  bannerName: string;
  ownerId: number;
  timestamp: string;


  constructor(name: string, description: string, logoName: string, bannerName: string, ownerId: number, timestamp: string) {
    this.name = name;
    this.description = description;
    this.logoName = logoName;
    this.bannerName = bannerName;
    this.ownerId = ownerId;
    this.timestamp = timestamp;
  }
}
