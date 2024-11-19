import {MemberDTO} from "./member-dto";
import {ErrorLists} from "../authentication/error-lists";

export class UpdateResponse {
    memberDTO!: MemberDTO;
    errorLists: ErrorLists;

    constructor() {
        this.errorLists = new ErrorLists([]);
    }
}
