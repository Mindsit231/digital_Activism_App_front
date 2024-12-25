export class FetchEntityLimited {
  limit: number;
  offset: number;
  optionalId: number | undefined;
  searchValue: string | undefined;

  constructor(pageSize: number, pageIndex: number, searchValue?: string) {
    this.limit = pageSize;
    this.offset = pageIndex * pageSize;
    this.searchValue = searchValue;
  }
}
