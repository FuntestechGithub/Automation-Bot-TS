import assert from 'assert';
import { DepGraph } from "dependency-graph";
import { ok } from 'assert'
import { stringify } from "./util";


/**
 * Factory describes a generic factory function signature. The type is generic over a few parameters:
 *
 * @template Type type the factory produces
 * @template Initial true if the `initialValue` passed to the factory must be defined
 */
export type Factory<Type, Initial extends boolean> = (initialValue: Initial extends true? Type : Type | undefined ) => Type;

/**
 * DependencyFactory is a function signature that produces an instance that depends on a set of
 * other services. The type is generic over a few parameters:
 *
 * @template Type type the factory produces
 * @template Dependencies the services this factory function depends on
 * @template Initial true if the `initialValue` passed to the factory must be defined
 */
export type DependencyFactory<Type, Dependencies, Initial extends boolean> = (
    dependencies: Dependencies,
    initialValue: Initial extends true ? Type : Type | undefined
) => Type;

export class ServiceCollection {
    // We store the full set of dependencies as a workaround to the fact that `DepGraph` throws an error if you
    // attempt to register a dependency to a node that does not yet exist.
    private readonly dependencies = new Map<string, string[]>()

    /**
     * `DepGraph` is a dependency graph data structure. In our case, the services we support are encoded as a
     * dependency graph where nodes are named with a key and store a list of factory methods.
     */
    private readonly graph = new DepGraph<Array<DependencyFactory<unknown, Record<string,unknown>, true>>>()

    /**
     * Cache constructed instances for reuse
     */
    private cache: Record<string, unknown> = {};

    constructor(defaultServices: Record<string,unknown> = {}){
        Object.entries(defaultServices).forEach(([key, instance]) => {
            this.addInstance(key, instance)
        })
    }

    /**
     * Register an instance by key (add a graph node). This will overwrite existing instances.
     *
     * @param key key of the instance being provided
     * @param instance instance to provide
     * @returns this for chaining
     */
    addInstance<InstanceType>(key: string, instance: InstanceType): this {
        this.graph.addNode(key, [() => instance])
        return this
    };

    // Register dependencies and then build nodes. Note: `nodes` is a function because ordering may
    // depend on results of dependency registration
    private buildNodes<ReturnType = Record<string, unknown>>(
        generateNodes: () => string[], // array of dependencies
        reuseServices: Record<string, unknown> = {}
    ): ReturnType{
        // this is actually adding dependencies to node
        this.dependencies.forEach((dependencies, node) => {
            dependencies.forEach((dependancy) => this.graph.addDependency(node, stringify(dependancy)))
        });

        // Generate nodes after registering dependencies so ordering is correct
        const nodes = generateNodes();

        const services = nodes.reduce((services, service) => {
            // Extra precaution. If graph doesn't have node
            if (!this.graph.hasNode(service)){
                return services
            }

            // Helper to generate return value
            const assignValue = (value: unknown) => ({
                ...services,
                [service]: value,
            })

            // Optionally reuse existing service
            const reusedService = reuseServices[service];
            if (reusedService !== undefined) {
                return assignValue(reusedService);
            }

            // Each node stores a list of factory methods.
            const factories = this.graph.getNodeData(service);

            // Produce the instance by reducing those factories, passing the instance along for composition.
            const instance = factories.reduce((value, factory) => factory(services, value), <unknown>services[service]);

            return assignValue(instance);

        }, <Record<string, unknown>>{});

        // Cache results for subsequent invocations that may desire pre-constructed instances
        Object.assign(this.cache, services);

        return services as ReturnType;
    }

    /**
     * Build a single service.
     *
     * @param key service to build
     * @param deep reconstruct all dependencies
     * @returns the service instance, or undefined
     */
    makeInstance<InstanceType>(key: string, deep = false): InstanceType | undefined {
        let initialServices: Record<string, unknown> | undefined
        if(!deep){
            // This is a destructuring assignment that removes a property with a dynamic key from an object.
            // { [key]:_, ...cached } is an object destructuring pattern 
            const { [key]:_, ...cached } = this.cache;
            initialServices = cached
        }

        const services = this.buildNodes<Record<string, InstanceType | undefined>>(
            // concat key to the dependencies array
            () => this.graph.dependenciesOf(key).concat(key),
            initialServices
        )
            
        return services[key]
    }

    /**
     * Build a single service and assert that it is not undefined.
     *
     * @param key service to build
     * @param deep reconstruct all dependencies
     * @returns the service instance
     */    
    mustMakeInstance<InstanceType = unknown>(key: string, deep = false): InstanceType{
        const instance = this.makeInstance<InstanceType>(key,deep);
        assert.ok(instance, `\`${key}\` instance undefined!`);
        return instance;
    }

    /**
     * Build the full set of services.
     *
     * @returns all resolved services
     */
    makeInstances<InstancesType>(): InstancesType {
        return this.buildNodes<InstancesType>(() => this.graph.overallOrder());
    }

    /**
     * Build the full set of services, asserting that the specified keys are not undefined.
     *
     * @param keys instances that must be not undefined
     * @returns all resolve services
     */
    mustMakeInstances<InstancesType extends Record<string, unknown> = Record<string, unknown>>(
        ...keys: string[]
    ): InstancesType{
        const instances = this.makeInstances<InstancesType>()

        keys.forEach((key) => {
            assert.ok(instances[key], `\`${key}\` instance undefined!`);
        })

        return instances;
    }

    /**
     * Register a factory (that expects the initial value that is not undefined) for a key.
     *
     * @param key key of the instance being provided
     * @param instance instance to provide
     * @returns this for chaining
     */
    composeFactory<InstanceType>(key: string, factory: Factory<InstanceType, true>): this;

    composeFactory<InstanceType, Dependencies>(
        key: string, 
        dependancies: string[], 
        factory: DependencyFactory<InstanceType, Dependencies, true>
    ): this;

    /**
     * @internal
     */
    composeFactory<InstanceType, Dependencies>(
        key: string,
        depsOrFactory: string[] | Factory<InstanceType, true>,
        maybeFactory?: DependencyFactory<InstanceType, Dependencies, true>
    ): this {
        if (maybeFactory) {
            return this.addFactory<InstanceType, Dependencies>(
                key,
                Array.isArray(depsOrFactory) ? depsOrFactory : [],
                (dependencies, value) => {
                    ok(value, `unable to create ${key}, initial value undefined`);

                    return maybeFactory(dependencies, value);
                }
            );
        } else {
            ok(typeof depsOrFactory === 'function', 'illegal invocation with undefined factory');

            return this.addFactory<InstanceType>(key, (value) => {
                ok(value, `unable to create ${key}, initial value undefined`);

                return depsOrFactory(value);
            });
        }
    }

    /**
     * Register a factory for a key.
     *
     * @param key key that factory will provide
     * @param factory function that creates an instance to provide
     * @returns this for chaining
     */    
    addFactory<InstancesType>(key: string, factory: Factory<InstancesType, true>): this;

    /**
     * Register a factory for a key with a set of dependencies.
     *
     * @param key key that factory will provide
     * @param dependencies set of things this instance depends on. Will be provided to factory function via `services`.
     * @param factory function that creates an instance to provide
     * @returns this for chaining
     */
    addFactory<InstanceType, Dependencies>(
        key: string,
        dependencies: string[],
        factory: DependencyFactory<InstanceType, Dependencies, false>
    ): this;
    
    /**
     * @internal
     */
    addFactory<InstanceType, Dependencies>(
        key: string,
        depsOrFactory: string[] | Factory<InstanceType, false>,
        maybeFactory?: DependencyFactory<InstanceType, Dependencies, false>
    ): this {
        const dependencies = Array.isArray(depsOrFactory) ? depsOrFactory : undefined;
        
        let factory: DependencyFactory<InstanceType, Dependencies, false> | undefined = maybeFactory;
        if (!factory && typeof depsOrFactory === 'function') {
            // if maybeFacotry doesn't exist and factory is a fucntion, then assign factory to depsOrFactory
            factory = (_services,value) => depsOrFactory(value);
        }

        // Asserts factory is not undefined
        ok(factory, 'illegal invocation with undefined factory');

        
        if (dependencies) {
            this.dependencies.set(key, dependencies);
        }

        // If the graph already has this key, fetch its data and remove it (to be replaced)
        let factories: unknown[] = [];
        if (this.graph.hasNode(key)) {
            factories = this.graph.getNodeData(key);
            this.graph.removeNode(key);
        }
        
        // Note: we have done the type checking above, so disabling no-explicit-any is okay.
        this.graph.addNode(key, factories.concat(factory) as any);

        return this;
    }
}

/**
 * // reference on graph
 * 
 *   graph: {
 *       nodes: { test: [Array] },
 *       outgoingEdges: { test: [] },
 *       incomingEdges: { test: [] },
 *       circular: undefined
 *   },
 * 
 *   const services = new ServiceCollection({"test": "test"});
 *   services.mustMakeInstance('test')
 *   console.log(services)

 *   cache: { test: 'test' }
 */
