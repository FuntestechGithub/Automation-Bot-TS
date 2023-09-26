"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.makeApp = void 0;
const express_1 = __importDefault(require("express"));
const z = __importStar(require("zod"));
const lib_1 = require("../../automationbot-action-adaptive-runtime/lib");
/**
 * Specify the defaultOptions and its dependancies
 */
const NonEmptyString = z
    .string()
    .refine((str) => str.length > 0, { message: "Must be a non-empty string" });
const TypedOptions = z.object({
    logErrors: z.boolean(),
    actionsEndpointPath: NonEmptyString,
    skillsEndpointPrefix: NonEmptyString,
    port: z.union([NonEmptyString, z.number()]),
    staticDir: NonEmptyString
});
const defaultOptions = {
    logErrors: true,
    actionsEndpointPath: "/actions",
    skillsEndpointPrefix: "/skills",
    port: 3978,
    staticDir: "wwwroot"
};
function makeApp(services, configuration, app = (0, express_1.default)()) {
    return __awaiter(this, void 0, void 0, function* () {
        // to make a instance, the graph needs to have its node first.    
        const { declarativeTypes, memoryScopes } = services.mustMakeInstances('declarativeTypes', 'memoryScopes');
        // const adapter = services.mustMakeInstance('adapter')
        return [
            app,
            (callback) => {
                const server = app.listen(3978, callback !== null && callback !== void 0 ? callback : (() => console.log(`server listening on port 3978`)));
                return server;
            }
        ];
    });
}
exports.makeApp = makeApp;
function start(applicationRoot, settingsDirectory) {
    return __awaiter(this, void 0, void 0, function* () {
        const [services, configuration] = yield (0, lib_1.getRuntimeServices)(applicationRoot, settingsDirectory);
        const [, listen] = yield makeApp(services, configuration);
        listen();
    });
}
exports.start = start;
//# sourceMappingURL=index.js.map