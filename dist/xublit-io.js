/**
 * Server-side application framework for Node.js
 * @version v1.0.0-rc.2
 * @link https://github.com/xublit/xublit-io#readme
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('babel-polyfill');

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _xublitInjector = require('xublit-injector');

var _xublitInjector2 = _interopRequireDefault(_xublitInjector);

var _path = require('path');

var path = _interopRequireWildcard(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * XublitApp
 *
 * @class
 */

var XublitApp = function (_EventEmitter) {
    _inherits(XublitApp, _EventEmitter);

    /**
     * Constructor
     *
     * @method     constructor
     * @param      {object}  opts    Options for the XublitApp
     */

    function XublitApp(opts) {
        _classCallCheck(this, XublitApp);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(XublitApp).call(this));

        opts = parseOptions(_this, opts);

        initInjector(_this, {
            baseDir: opts.baseDir,
            includeDirs: _this.includeDirs,
            bootstrapScopeVars: {
                app: _this
            }
        });

        return _this;
    }

    _createClass(XublitApp, [{
        key: 'emit',
        value: function emit() {
            throw new Error('No.');
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

    }, {
        key: 'beforeStart',
        value: function beforeStart(fn) {
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

    }, {
        key: 'afterBootstrap',
        value: function afterBootstrap(fn) {
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

    }, {
        key: 'onceStarted',
        value: function onceStarted(fn) {
            this.once('started', fn);
            return this;
        }

        /**
         * Starts the XublitApp by bootstrapping all modules
         *
         * @method     start
         * @return     {XublitApp}
         */

    }, {
        key: 'start',
        value: function start() {

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

    }, {
        key: 'stop',
        value: function stop() {
            var _this2 = this;

            this.on('stop', function () {
                _this2.halt();
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

    }, {
        key: 'halt',
        value: function halt(confirm) {

            if (true !== confirm) {
                return this;
            }

            process.exit();
        }
    }, {
        key: 'includeDirs',
        get: function get() {

            var opts = this.options;

            var includeDirs = opts.includeDirs.concat([path.join(opts.baseDir, opts.srcDir)]);

            if (true === opts.includeNpmXublits) {
                includeDirs.push(path.join(opts.baseDir, 'node_modules', 'xublit-*'));
            }

            return includeDirs;
        }
    }]);

    return XublitApp;
}(_events2.default);

exports.default = XublitApp;

function initInjector(xublitApp, opts) {
    Object.defineProperty(xublitApp, 'injector', {
        value: new _xublitInjector2.default(opts)
    });
}

function parseOptions(xublitApp, opts) {

    if (!opts.baseDir) {
        throw new Error('Missing "baseDir" option');
    }

    Object.defineProperty(xublitApp, 'options', {
        value: {}
    });

    var defaults = {
        baseDir: '',
        srcDir: './src',
        etcDir: './etc',
        includeNpmXublits: true,
        includeDirs: []
    };

    Object.keys(defaults).forEach(function (key) {

        var value = key in opts ? opts[key] : defaults[key];

        switch (key) {

            case 'includeDirs':
                _xublitInjector2.default.assertValidIncludeDirs(value);
                value = value.slice(0);
                break;

        }

        Object.defineProperty(xublitApp.options, key, {
            value: value,
            enumerable: true
        });
    });

    return xublitApp.options;
}

function emit(xublitApp) {
    var emitArgs = [].concat(Array.prototype.slice.call(arguments));
    emitArgs.shift();
    _events2.default.prototype.emit.apply(xublitApp, emitArgs);
}
//# sourceMappingURL=xublit-io.js.map
