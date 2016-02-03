import 'babel-polyfill';

import EventEmitter from 'events';
import Injector from 'xublit-injector';

import * as path from 'path';

/**
 * XublitApp
 *
 * @class
 */
export default class XublitApp extends EventEmitter {

    /**
     * Constructor
     *
     * @method     constructor
     * @param      {object}  opts    Options for the XublitApp
     */
    constructor (opts) {

        super();

        opts = parseOptions(this, opts);

        initInjector(this, {
            baseDir: opts.baseDir,
            includeDirs: this.includeDirs,
            bootstrapScopeVars: {
                app: this,
            },
        });

    }

    get includeDirs () {

        var opts = this.options;

        var includeDirs = opts.includeDirs.concat([
            path.join(opts.baseDir, opts.srcDir),
        ]);

        if (true === opts.includeNpmXublits) {
            includeDirs.push(
                path.join(opts.baseDir, 'node_modules', 'xublit-*')
            );
        }

        return includeDirs;

    }

    /**
     * Run `fn` before starting
     * 
     * Same as calling `xublitApp.once('before:start', fn)`
     *
     * @method     beforeStart
     * @param      {Function}  fn      The function to run
     * @return     {XublitApp}
     */
    beforeStart (fn) {
        this.once('before:start', fn);
        return this;
    }

    /**
     * Run `fn` when all modules have been bootstrapped
     * 
     * This is the best place to get your modules to do startup things like
     * connecting to databases, starting web servers, etc.
     * 
     * Same as calling `xublitApp.once('bootstrapped', fn)`
     *
     * @method     afterBootstrap
     * @param      {Function}  fn      The function to run
     * @return     {XublitApp}
     */
    afterBootstrap (fn) {
        this.once('bootstrapped', fn);
        return this;
    }

    /**
     * Run `fn` when the app is started
     *
     * @method     onceStarted
     * @param      {Function}  fn      The function to run
     * @return     {XublitApp}
     */
    onceStarted (fn) {
        this.once('started', fn);
        return this;
    }

    /**
     * Starts the XublitApp by bootstrapping all modules
     *
     * @method     start
     * @return     {XublitApp}
     */
    start () {

        this.emit('before:start');

        this.injector.bootstrap();

        this.emit('bootstrapped');
        this.emit('started');

        return this;

    }

    /**
     * Stops the XublitApp
     *
     * @method     stop
     * @return     {XublitApp}
     */
    stop () {

        this.on('stop', () => {
            this.halt();
        });

        this.emit('stop');

        return this;

    }

    /**
     * Exits the process
     *
     * @method     halt
     * @param      {boolean}  confirm  Must be true to exit
     * @return     {XublitApp}
     */
    halt (confirm) {
        
        if (true !== confirm) {
            return this;
        }
        
        process.exit();

    }

}

function initInjector (xublitApp, opts) {
    Object.defineProperty(xublitApp, 'injector', {
        value: new Injector(opts),
    });
}

function parseOptions (xublitApp, opts) {

    if (!opts.baseDir) {
        throw new Error('Missing "baseDir" option');
    }

    Object.defineProperty(xublitApp, 'options', {
        value: {},
    });

    var defaults = {
        baseDir: '',
        srcDir: './src',
        etcDir: './etc',
        includeNpmXublits: true,
        includeDirs: [],
    };

    Object.keys(defaults).forEach((key) => {

        var value = key in opts ? opts[key] : defaults[key];

        switch (key) {

            case 'includeDirs':
                Injector.assertValidIncludeDirs(value);
                value = value.slice(0);
                break;

        }

        Object.defineProperty(xublitApp.options, key, {
            value: value,
            enumerable: true,
        });

    });

    return xublitApp.options;

}