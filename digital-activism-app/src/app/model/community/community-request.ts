export class CommunityRequest {
  name: string;
  description: string;

  logoName: string;
  logoUrl: string;

  bannerName: string;
  bannerUrl: string;

  constructor(name: string, description: string, logoName: string, logoUrl: string,
              bannerName: string, bannerUrl: string) {
    this.name = name;
    this.description = description;
    this.logoName = logoName;
    this.logoUrl = logoUrl;
    this.bannerName = bannerName;
    this.bannerUrl = bannerUrl;
  }
}
