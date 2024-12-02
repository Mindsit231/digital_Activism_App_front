
export class CommunityDTO {
  name: string;
  description: string;
  logoName: string;
  logo: string;
  bannerName: string;
  banner: string;
  ownerId: number;
  timestamp: string;

  logoUrl: string | undefined;
  bannerUrl: string | undefined;


  constructor(name: string, description: string, logoName: string, logo: string, bannerName: string, banner: string, ownerId: number, timestamp: string) {
    this.name = name;
    this.description = description;
    this.logoName = logoName;
    this.logo = logo;
    this.bannerName = bannerName;
    this.banner = banner;
    this.ownerId = ownerId;
    this.timestamp = timestamp;
  }

  static fromJson(jsonCommunityDTO: CommunityDTO): CommunityDTO {
    let communityDTO: CommunityDTO = new CommunityDTO(
      jsonCommunityDTO.name,
      jsonCommunityDTO.description,
      jsonCommunityDTO.logoName,
      jsonCommunityDTO.logo,
      jsonCommunityDTO.bannerName,
      jsonCommunityDTO.banner,
      jsonCommunityDTO.ownerId,
      jsonCommunityDTO.timestamp);

    communityDTO.logoUrl = communityDTO.getLogoUrl();
    communityDTO.bannerUrl = communityDTO.getBannerUrl();

    return communityDTO;
  }

  private getLogoUrl() {
    if(this.logoName != null && this.logo != null) {
      const byteArray = new Uint8Array(
        atob(this.logo).split('').map(char => char.charCodeAt(0))
      )
      const blob = new Blob([byteArray], { type: 'image/png' });
      return URL.createObjectURL(blob);

      // return `data:image/png;base64,${this.logo}`;
    } else{
      return "assets/placeholder/placeholder-logo.jpg"
    }
  }

  private getBannerUrl(): string {
    if(this.bannerName != null && this.banner != null) {
      const byteArray = new Uint8Array(
        atob(this.banner).split('').map(char => char.charCodeAt(0))
      )
      const blob = new Blob([byteArray], { type: 'image/png' });
      return URL.createObjectURL(blob);

      // return `data:image/png;base64,${this.banner}`;
    } else{
      return "assets/placeholder/placeholder-banner.jpg"
    }
  }
}
