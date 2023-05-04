/**
 * Thrown when
 */
export class UnknownComponentError extends Error {
    /**
     * Catching unkown number of arguments with Rest operator.
     */
    constructor(...args) {
        // Calling super with Spread operator.
        super(...args);
    }
}
