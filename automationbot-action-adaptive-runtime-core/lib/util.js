"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = void 0;
// Necessary to help coerce `keyof T` keys to strings. Only used internally to this class.
const stringify = (k) => typeof k === "string" ? k : k.toString();
exports.stringify = stringify;
//# sourceMappingURL=util.js.map