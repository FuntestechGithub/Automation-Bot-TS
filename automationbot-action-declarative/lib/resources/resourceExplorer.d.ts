/**
 * @module automationbot-action-declarative
 */
import { ResourceProvider, ResourceChangeEvent } from "./resourceProvider";
import { ResourceExplorerOptions } from "./resourceExplorerOptions";
import { Resource } from './resource';
export declare class ResourceExplorer {
    private _declarativeTypes;
    private _kindToType;
    private _kindDeserializer;
    private _eventEmitter;
    private _cache;
    private _typesLoaded;
    /**
     * Initializes a new instance of the [ResourceExplorer](botbuilder-dialogs.declarative.ResourceExplorer) class.
     *
     * @param {ResourceProvider[]} providers The list of [ResourceProvider](botbuilder-dialogs-declarative.ResourceProvider) to initialize the current instance.
     */
    constructor(providers: ResourceProvider[]);
    /**
     * Initializes a new instance of the [ResourceExplorer](botbuilder-dialogs.declarative.ResourceExplorer) class.
     *
     * @param {ResourceExplorerOptions} options The configuration options.
     */
    constructor(options?: ResourceExplorerOptions);
    /**
     * Gets resource providers.
     */
    readonly resourceProviders: ResourceProvider[];
    /**
     * Gets resource type id extensions managed by resource explorer.
     */
    readonly resourceTypes: Set<string>;
    /**
     * Event which fires when a resource is changed.
     */
    set changed(callback: (event: ResourceChangeEvent, resources: Resource[]) => void);
}
//# sourceMappingURL=resourceExplorer.d.ts.map