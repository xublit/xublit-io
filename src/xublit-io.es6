import 'babel-polyfill';

import EventEmitter from 'events';
import Injector from 'xublit-injector';
import XublitEtc from 'xublit-etc';

import * as path from 'path';

import XublitAppOptions from './xublit-app-options';

const INITIALISING = 'INITIALISING';
const INITIALISED = 'INITIALISED';
const STARTING = 'STARTING';
const BOOTSTRAPPING = 'BOOTSTRAPPING';
const BOOTSTRAPPED = 'BOOTSTRAPPED';
const RUNNING = 'RUNNING';
const STOPPING = 'STOPPING';

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
     * @param      {object}  options    Options for the XublitApp
     */
    constructor (options) {

        super();

        this.state = INITIALISING;

        bindStateChangeHandlers(this);

        initOptions(this, options || {});

        initInjector(this, {
            baseDir: this.options.baseDir,
            includeDirs: this.options.includeDirs,
            bootstrapScopeVars: {
                app: this,
                $options: (moduleRef) => {
                    return this.moduleOptions(moduleRef);
                },
            },
        });

        this.statusLog = [];
        this.configuredDependencies = {};

    }

    static createInjector (opts) {
        return new Injector(opts);
    }

    set status (newValue) {
        this.stateLog.push({
            status: newValue,
            ts: Date.now(),
        });
    }

    get status () {
        return this.stateLog[0].status;
    }

    get isConfigurable () {
        return [INITIALISING, INITIALISED].indexOf(this.status) > -1;
    }

    get isStartable () {
        return INITIALISED === this.status;
    }

    /**
     * Provide a "configured" dependency
     * 
     * Creates a dependency - injectable by it's `ref` - for the modules in your
     * app.  This dependency will be an instance of the module who's `ref` is
     * defined in `config.createInstanceOf` which will have been bootstrapped
     * with `this.config()` as the configuration loaded
     *
     * @method     provide
     * @param      {string}  dependencyRef  The reference for the dependency
     * @param      {object}  config         The configuration
     */
    provide (dependencyRef, config) {

        if (this.isConfigurable) {
            throw new Error(
                'Configured dependencies may only be provided before app.start()'
            );
        }

        if (!dependencyRef) {
            throw new Error('Invalid dependency ref');
        }

        this.configuredDependencies[dependencyRef] = config;

        return this;

    }

    emit () {
        throw new Error('No.');
    }

    moduleOptions (moduleRef) {
        return this.core.$etc.readConfigSync(moduleRef);
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

        if (!this.isStartable) {
            throw new Error('App is not currently startable');
        }

        emit(this, 'before:start');

        provideDependenciesToInjector(this);

        emit(this, 'before:bootstrap');

        this.injector.bootstrap();

        emit(this, 'bootstrapped');
        emit(this, 'started');

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

        emit(this, 'stop');

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

function initOptions (xublitApp, options) {
    Object.defineProperty(xublitApp, 'options', {
        value: new XublitAppOptions(options),
    });
}

function initInjector (xublitApp, opts) {

    var injector = XublitApp.createInjector(opts);

    Object.defineProperty(xublitApp, 'injector', {
        value: injector,
    });

    injector.loadModules();

}

function emit (xublitApp) {
    var emitArgs = [...arguments];
    emitArgs.shift();
    EventEmitter.prototype.emit.apply(xublitApp, emitArgs);
}

function bootstrapEtc (xublitApp) {
    xublitApp.injector.override()
}

function bindStateChangeHandlers (xublitApp) {

    xublitApp.once('before:start', () => {
        xublitApp.state = STARTING;
    });

    xublitApp.once('before:bootstrap', () => {
        xublitApp.state = BOOTSTRAPPING;
    });

    xublitApp.once('bootstrapped', () => {
        xublitApp.state = BOOTSTRAPPED;
    });

    xublitApp.once('started', () => {
        xublitApp.state = RUNNING;
    });

    xublitApp.once('stop', () => {
        xublitApp.state = STOPPING;
    });

}

function provideDependenciesToInjector (xublitApp) {

    var injector = xublitApp.injector;
    var configuredDependencies = xublitApp.configuredDependencies;
    var refs = Object.keys(configuredDependencies);

    refs.forEach((ref) => {

        var props = configuredDependencies[ref];
        var source = injector.getModule(props.createInstanceOf);

        injector.provide(ref, source.dependencyRefs, source.bootstrapFn, );

    });


}
