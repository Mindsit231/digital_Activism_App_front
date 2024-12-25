export class FetchEntityLimited {
  limit: number;
  offset: number;
  optionalId: number | undefined;

  constructor(pageSize: number, pageIndex: number) {
    this.limit = pageSize;
    this.offset = pageIndex * pageSize;
  }
}
