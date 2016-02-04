import 'babel-polyfill';

import EventEmitter from 'events';
import Injector from 'xublit-injector';
import XublitEtc from 'xublit-etc';

import * as path from 'path';

import XublitAppOptions from './xublit-app-options';

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

    }

    static createInjector (opts) {
        return new Injector(opts);
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

        emit(this, 'before:start');

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

    // addCoreEtcDependency(xublitApp, injector);


    Object.defineProperty(xublitApp, 'injector', {
        value: injector,
    });

}

function addCoreEtcDependency (xublitApp, injector) {

    var bootstrapScope = Injector.createBootstrapScope({
        options: {
            etcPath: xublitApp.absPathToEtcFiles,
        },
    });

    var wrappedModule = Injector.wrapModule(XublitEtc, '$etc', bootstrapScope);

    wrappedModule.bootstrap();

    injector.override('$etc', wrappedModule);

    return 

}

function emit (xublitApp) {
    var emitArgs = [...arguments];
    emitArgs.shift();
    EventEmitter.prototype.emit.apply(xublitApp, emitArgs);
}

function bootstrapEtc (xublitApp) {
    xublitApp.injector.override()
}
