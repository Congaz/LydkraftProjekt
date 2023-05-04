/**
 * Thrown when attemting to re-assign id to a comopoent.
 */
export class ReassignError extends Error {
    /**
     * Catching unkown number of arguments with Rest operator.
     */
    constructor(...args) {
        // Calling super with Spread operator.
        super(...args);
    }
}
