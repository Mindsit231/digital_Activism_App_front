export class CommunityDTO {
  id: number;
  name: string;
  description: string;
  logoName: string;
  bannerName: string;
  timestamp: string;
  joined: boolean;
  isAdmin: boolean;

  logoUrl: string | undefined;
  bannerUrl: string | undefined;


  constructor(id: number, name: string, description: string, logoName: string,
              bannerName: string, timestamp: string, joined: boolean, isAdmin: boolean) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.logoName = logoName;
    this.bannerName = bannerName;
    this.timestamp = timestamp;
    this.joined = joined;
    this.isAdmin = isAdmin;
  }

  static fromJson(jsonCommunityDTO: CommunityDTO): CommunityDTO {
    return new CommunityDTO(
      jsonCommunityDTO.id,
      jsonCommunityDTO.name,
      jsonCommunityDTO.description,
      jsonCommunityDTO.logoName,
      jsonCommunityDTO.bannerName,
      jsonCommunityDTO.timestamp,
      jsonCommunityDTO.joined,
      jsonCommunityDTO.isAdmin);
  }

  public toggleJoin() {
    this.joined = !this.joined;
  }

}
