"use strict";
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
exports.getRuntimeServices = void 0;
const lib_1 = require("../../automationbot-action-adaptive-runtime-core/lib");
const configuration_1 = require("./configuration");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function getRuntimeServices(applicationRoot, configurationOrSettingsDirectory) {
    return __awaiter(this, void 0, void 0, function* () {
        let configuration;
        if (typeof configurationOrSettingsDirectory === 'string') {
            // initializes the configuration and loads both arguments value and environment variables to configuration store
            configuration = new configuration_1.Configuration().argv().env();
            const files = ['appseetings.json'];
            files.forEach((file) => configuration.file(path_1.default.join(configurationOrSettingsDirectory, file)));
            yield normalizeConfiguration(configuration, applicationRoot);
        }
        /**
         * Here defines all default services (in Record type) for ServiceCollection class
         */
        const services = new lib_1.ServiceCollection({
            declarativeTypes: [],
            memoryScopes: [],
        });
        return [services, configuration];
    });
}
exports.getRuntimeServices = getRuntimeServices;
function normalizeConfiguration(configuration, applicationRoot) {
    return __awaiter(this, void 0, void 0, function* () {
        // Override applicationRoot setting
        configuration.set(['applicationRoot'], applicationRoot);
        // Override root dialog setting
        configuration.set(['defaultRootDialog'], yield new Promise((resolve, reject) => 
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        fs_1.default.readdir(applicationRoot, (err, files) => err ? reject(err) : resolve(files.find((file) => file.endsWith('.dialog'))))));
    });
}
//# sourceMappingURL=index.js.map