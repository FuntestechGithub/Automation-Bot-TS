/**
 * @module automationbot-action-declarative
 */
import { DeclarativeType } from './declarativeType';
import { ResourceExplorer } from './resources/resourceExplorer';
/**
 * Interface for registering declarative types.
 */
export interface ComponentDeclarativeTypes {
    getDeclarativeTypes(resourceExplorer: ResourceExplorer): DeclarativeType[];
}
/**
 * Check if a [ComponentRegistration](xref:botbuilder-core.ComponentRegistration) is
 * [ComponentDeclarativeTypes](xref:botbuilder-dialogs-declarative.ComponentDeclarativeTypes) or not.
 *
 * in original code, it used check() method, but it is deprecated.
 *
 * @param {any} component The component registration.
 * @returns {boolean} Type check result.
 */
export declare function isComponentDeclarativeTypes(component: unknown): component is ComponentDeclarativeTypes;
//# sourceMappingURL=componentDeclarativeTypes.d.ts.map