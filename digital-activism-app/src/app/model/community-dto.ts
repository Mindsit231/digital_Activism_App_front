import {FileManager} from './file-manager';

export class CommunityDTO extends FileManager{
  id: number;
  name: string;
  description: string;
  logoName: string;
  logo: string;
  bannerName: string;
  banner: string;
  ownerId: number;
  timestamp: string;
  joined: boolean;

  logoUrl: string | undefined;
  bannerUrl: string | undefined;


  constructor(id: number, name: string, description: string, logoName: string, logo: string, bannerName: string, banner: string, ownerId: number, timestamp: string, joined: boolean) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.logoName = logoName;
    this.logo = logo;
    this.bannerName = bannerName;
    this.banner = banner;
    this.ownerId = ownerId;
    this.timestamp = timestamp;
    this.joined = joined;
  }

  static fromJson(jsonCommunityDTO: CommunityDTO): CommunityDTO {
    let communityDTO: CommunityDTO = new CommunityDTO(
      jsonCommunityDTO.id,
      jsonCommunityDTO.name,
      jsonCommunityDTO.description,
      jsonCommunityDTO.logoName,
      jsonCommunityDTO.logo,
      jsonCommunityDTO.bannerName,
      jsonCommunityDTO.banner,
      jsonCommunityDTO.ownerId,
      jsonCommunityDTO.timestamp,
      jsonCommunityDTO.joined);

    communityDTO.logoUrl = communityDTO.getLogoUrl();
    communityDTO.bannerUrl = communityDTO.getBannerUrl();

    return communityDTO;
  }

  private getLogoUrl() {
    if (this.logoName != null && this.logo != null) {
      return this.convertBytesToUrl(this.logo, 'image/png');

      // return `data:image/png;base64,${this.logo}`;
    } else {
      return "assets/placeholder/placeholder-logo.jpg"
    }
  }

  private getBannerUrl(): string {
    if (this.bannerName != null && this.banner != null) {
      return this.convertBytesToUrl(this.banner, 'image/png');

      // return `data:image/png;base64,${this.banner}`;
    } else {
      return "assets/placeholder/placeholder-banner.jpg"
    }
  }
}
