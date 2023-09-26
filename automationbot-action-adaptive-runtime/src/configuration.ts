import { Configuration as CoreConfiguration } from '../../automationbot-action-adaptive-runtime-core/lib';
import * as z from 'zod';
import { Provider } from 'nconf';
import yargs from 'yargs-parser';



export class Configuration implements CoreConfiguration {
    private prefix: string[] = [];
    
    /**
     * // create a fresh configuration store (Provider())
     * 
     * // .use('memrory')
     * This configures the nconf instance to use the 'memory' storage backend. 
     * The 'memory' backend is a simple storage mechanism where configuration 
     * settings are stored in memory (RAM). It is particularly useful for temporary
     *  configurations or when you don't need to persist the data to disk or any other external source.
     */
    private provider = new Provider().use('memory');

    /**
     * Create a configuration instance and put record 'initialValue' into provider 
     * @param initialValue Optional set of default values to provider
     */
    constructor(initialValue?: Record<string,unknown>) {
        if (initialValue) {
            Object.entries(initialValue).forEach(([key, value]) => this.provider.set(key, value));
        }
    }

    /**
     * process.argv.slice(2) is to get rig of first two (node executable and script file) from command-line
     * for example, if command is 'node script.js hello world 123', then argv will be ['hello', 'world', '123']
     * 
     * yargs will mapping the argv to a object, for example, { _: [ 'hello', 'world', '123' ] } or { _: [], say: 'hello', name: 'nate' } with flag
     * @param argv arguments to parse, defaults to `process.argv`
     * @returns this for chaining
     */
    argv(argv = process.argv.slice(2)): this {
        this.provider.argv({
            argv: yargs(argv, {
                configuration: {
                    'parse-numbers': false,
                },
            }),
        });
        return this;
    }

    /**
     * Load environment variables as a configuration source.
     *
     * @param separator value used to indicate nesting
     * @returns this for chaining
     */
    env(separator = '__'): this {
        this.provider.env(separator);
        return this;
    }

    /**
     * combine prefix and path together, join them with ":"
     * @param path 
     * @returns string of concated elements
     */
    private key(path: string[] | null): string {
        return this.prefix.concat(path?? []).join(':')
    }

    /**
     * Get a value by path.
     * From provider, use get method with the "string" version of path 
     * @param path 
     * @returns 
     */
    get<T = unknown>(path: string[]=[]): T | undefined {
        return this.provider.get(this.key(path) || undefined)
    }

    /**
     * Set a value by path.
     *
     * @param path path to value
     * @param value value to set
     */
    set(path: string[], value:unknown): void {
        // if path is empty, throw the error
        if (!path.length) {
            throw new Error('`path` must be non-empty');
        }

        this.provider.set(this.key(path), value)
    }

    /**
     * Load a file as a configuration source.
     * 
     * @param name file name
     * @param override optional flag that ensures this file takes precedence over other files
     * @returns this for chaining
     */
    file(name:string, override = false): this {
        this.provider.file(name, name)
        return this;
    }
}

/**
 * // example of argv() and get()
 * command-line example: ts-node .\configuration.ts --say hello --name  nate
 * const configuration = new Configuration().argv() // { _: [], say: 'hello', name: 'nate' }
 * configuration.set(['say','what'], 'world')
 * console.log(configuration.get([])) // { _: [], say: { what: 'world' }, name: 'nate' } 
 * 
 * 
 * // example of load file
 * const configuration = new Configuration()
 * configuration.file('appsettings.json')
 * console.log(configuration.get())
 */


