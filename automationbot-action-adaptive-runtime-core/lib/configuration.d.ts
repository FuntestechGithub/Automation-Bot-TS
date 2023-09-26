export interface Configuration {
    /**
     * Look up a value by path
     * @param path path to get
     * @returns the value or undefined
     */
    get<T = unknown>(path?: string[]): T | undefined;
    /**
     * Set a value by path.
     *
     * @param path path to get
     * @param value path to get
     */
    set(path: string[], value: unknown): void;
}
//# sourceMappingURL=configuration.d.ts.map