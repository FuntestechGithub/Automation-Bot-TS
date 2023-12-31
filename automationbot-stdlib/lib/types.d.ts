export type Nil = null | undefined;
export type Maybe<T> = T | Nil;
export type Newable<T, A extends unknown[] = unknown[]> = new (...args: A) => T;
export type Extends<T> = Function & {
    prototype: T;
};
//# sourceMappingURL=types.d.ts.map