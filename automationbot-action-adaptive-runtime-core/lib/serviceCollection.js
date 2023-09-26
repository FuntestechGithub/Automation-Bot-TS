"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCollection = void 0;
const assert_1 = __importDefault(require("assert"));
const dependency_graph_1 = require("dependency-graph");
const util_1 = require("./util");
class ServiceCollection {
    constructor(defaultServices = {}) {
        // We store the full set of dependencies as a workaround to the fact that `DepGraph` throws an error if you
        // attempt to register a dependency to a node that does not yet exist.
        this.dependencies = new Map();
        /**
         * `DepGraph` is a dependency graph data structure. In our case, the services we support are encoded as a
         * dependency graph where nodes are named with a key and store a list of factory methods.
         */
        this.graph = new dependency_graph_1.DepGraph();
        /**
         * Cache constructed instances for reuse
         */
        this.cache = {};
        Object.entries(defaultServices).forEach(([key, instance]) => {
            this.addInstance(key, instance);
        });
    }
    /**
     * Register an instance by key (add a graph node). This will overwrite existing instances.
     *
     * @param key key of the instance being provided
     * @param instance instance to provide
     * @returns this for chaining
     */
    addInstance(key, instance) {
        this.graph.addNode(key, [() => instance]);
        return this;
    }
    ;
    // Register dependencies and then build nodes. Note: `nodes` is a function because ordering may
    // depend on results of dependency registration
    buildNodes(generateNodes, // array of dependencies
    reuseServices = {}) {
        // this is actually adding dependencies to node
        this.dependencies.forEach((dependencies, node) => {
            dependencies.forEach((dependancy) => this.graph.addDependency(node, (0, util_1.stringify)(dependancy)));
        });
        // Generate nodes after registering dependencies so ordering is correct
        const nodes = generateNodes();
        const services = nodes.reduce((services, service) => {
            // Extra precaution. If graph doesn't have node
            if (!this.graph.hasNode(service)) {
                return services;
            }
            // Helper to generate return value
            const assignValue = (value) => (Object.assign(Object.assign({}, services), { [service]: value }));
            // Optionally reuse existing service
            const reusedService = reuseServices[service];
            if (reusedService !== undefined) {
                return assignValue(reusedService);
            }
            // Each node stores a list of factory methods.
            const factories = this.graph.getNodeData(service);
            // Produce the instance by reducing those factories, passing the instance along for composition.
            const instance = factories.reduce((value, factory) => factory(services, value), services[service]);
            return assignValue(instance);
        }, {});
        // Cache results for subsequent invocations that may desire pre-constructed instances
        Object.assign(this.cache, services);
        return services;
    }
    /**
     * Build a single service.
     *
     * @param key service to build
     * @param deep reconstruct all dependencies
     * @returns the service instance, or undefined
     */
    makeInstance(key, deep = false) {
        let initialServices;
        if (!deep) {
            // This is a destructuring assignment that removes a property with a dynamic key from an object.
            // { [key]:_, ...cached } is an object destructuring pattern 
            const _a = this.cache, _b = key, _ = _a[_b], cached = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
            initialServices = cached;
        }
        const services = this.buildNodes(
        // concat key to the dependencies array
        () => this.graph.dependenciesOf(key).concat(key), initialServices);
        return services[key];
    }
    /**
     * Build a single service and assert that it is not undefined.
     *
     * @param key service to build
     * @param deep reconstruct all dependencies
     * @returns the service instance
     */
    mustMakeInstance(key, deep = false) {
        const instance = this.makeInstance(key, deep);
        assert_1.default.ok(instance, `\`${key}\` instance undefined!`);
        return instance;
    }
    /**
     * Build the full set of services.
     *
     * @returns all resolved services
     */
    makeInstances() {
        return this.buildNodes(() => this.graph.overallOrder());
    }
    /**
     * Build the full set of services, asserting that the specified keys are not undefined.
     *
     * @param keys instances that must be not undefined
     * @returns all resolve services
     */
    mustMakeInstances(...keys) {
        const instances = this.makeInstances();
        keys.forEach((key) => {
            assert_1.default.ok(instances[key], `\`${key}\` instance undefined!`);
        });
        return instances;
    }
}
exports.ServiceCollection = ServiceCollection;
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
//# sourceMappingURL=serviceCollection.js.map