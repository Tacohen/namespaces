import Namespace from './namespace';
import Storage from './storage';
import Resolver from './resolver';

/**
 * Creates a new Container.
 * @class
 * @classdesc Represents a container for registered modules.
 */
export default class Container extends Namespace {
    /** @constructs
     * @param {string} separator - Namespace separator. Optional. Default '/'.
     */
    constructor(separator = '/') {
        super(separator, '', new Storage(separator));
        this._resolver = new Resolver(this._storage);
    }

    /**
     * Returns a module namespace.
     * @param {string} namespace - Module namespace. Optional.
     * @returns {Namespace} Module namespace.
     */
    register(namespace) {
        console.warn('Method "register" is deprecated. Use container itself or "namespace" method instead.');
        return new Namespace(this._separator, namespace || this._name, this._storage);
    }

    /**
     * Resolve a module.
     * @param {string} path - Module namespace.
     * @returns {Module} new Module.
     */
    resolve(path) {
        return this._resolver.resolve(path);
    }

    /**
     * Resolves all modules from particular namespace.
     * @param {string} namespace - Target namespace.
     * @returns {Map<string, any>} Map of module values, where key is module name.
     */
    resolveAll(namespace) {
        return this._resolver.resolveAll(namespace);
    }
}
