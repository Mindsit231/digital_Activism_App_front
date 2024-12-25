export class Role {
  role: string;

  constructor(role: string) {
    this.role = role;
  }
}

export const publicRole = new Role('PUBLIC');
export const authenticatedRole = new Role('AUTHENTICATED');
export const siteAdminRole = new Role('SITE_ADMIN');
export const communityAdminRole = new Role('COMMUNITY_ADMIN');

export const roles = {
  publicRole,
  authenticatedRole,
  siteAdminRole,
  communityAdminRole
}
