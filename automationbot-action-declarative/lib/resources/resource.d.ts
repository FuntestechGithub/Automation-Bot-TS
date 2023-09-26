/**
 * @module automationbot-action-declarative
 */
export declare abstract class Resource {
    protected _id: string;
    protected _fullname: string;
    get id(): string;
    get fullname(): string;
    abstract readText(): string;
}
//# sourceMappingURL=resource.d.ts.map