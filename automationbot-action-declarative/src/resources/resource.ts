/**
 * @module automationbot-action-declarative
 */

export abstract class Resource {
    protected _id: string;
    protected _fullname: string;

    get id(): string {
        return this._id;
    }

    get fullname(): string {
        return this.fullname
    }

    abstract readText(): string;
}
