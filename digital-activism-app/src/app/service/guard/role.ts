export class Role {
  role: string;

  constructor(role: string) {
    this.role = role;
  }
}

export const publicRole = new Role('PUBLIC');
export const authenticatedRole = new Role('AUTHENTICATED');
export const adminRole = new Role('ADMIN');

export const roles = {
  publicRole,
  authenticatedRole,
  adminRole
}
