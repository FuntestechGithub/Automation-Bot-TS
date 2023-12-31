/**
 * @module automationbot-action-declarative
 */
import { ResourceExplorer } from "./resourceExplorer";
import { Resource } from "./resource";
/**
 * Resource change event types.
 * added - a new resource has been added.
 * changed - an existing resource has been changed.
 * removed - an existing resource has been removed.
 */
export declare enum ResourceChangeEvent {
    added = "added",
    changed = "changed",
    removed = "removed"
}
/**
 * Abstract class for looking up a resource by id.
 */
export declare abstract class ResourceProvider {
    private _resourceExplorer;
    private _eventEmitter;
    protected _id: string;
    /**
     * Initialize an instance of `ResourceProvider` class.
     *
     * @param resourceExplorer Resource explorer.
     */
    constructor(resourceExplorer: ResourceExplorer);
    /**
     * Event which is fired if any resource managed by the resource provider detects changes to the underlining resource.
     *
     * @param callback Callback function to be called when an event fired.
     */
    set changed(callback: (event: ResourceChangeEvent, resources: Resource[]) => void);
    /**
     * Gets the resource explorer.
     *
     * @returns The resource explorer.
     */
    get resourceExplorer(): ResourceExplorer;
    /**
     * Gets the ID for this resource provider.
     *
     * @returns The ID for this resource provider.
     */
    get id(): string;
    /**
     * Gets resource by id.
     *
     * @param id Resource id.
     */
    abstract getResource(id: string): Resource;
    /**
     * Enumerate resources.
     *
     * @param extension Extension filter.
     */
    abstract getResources(extension: string): Resource[];
    /**
     * Refresh any cached resources.
     */
    abstract refresh(): void;
    /**
     * @protected
     * Actions to perform when the current object is changed.
     * @param event Resource change event.
     * @param resources A collection of changed resources.
     */
    protected onChanged(event: ResourceChangeEvent, resources: Resource[]): void;
}
//# sourceMappingURL=resourceProvider.d.ts.map