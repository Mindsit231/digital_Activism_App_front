export class ActionStatus {
    status: string;

    constructor(status: string) {
        this.status = status;
    }
}

export const ACTION_NULL = new ActionStatus("null");
export const ACTION_SUCCESS = new ActionStatus("success");
export const ACTION_FAILURE = new ActionStatus("failure");
