import * as path from 'path';

const defaults = {
    debug: false,
    srcDir: './src',
    etcDir: './etc',
    includeNpmXublits: true,
    includeDirs: [],
};

export default class XublitAppOptions {

    constructor (options) {

        XublitAppOptions.verifyOptions(options);

        Object.defineProperty(this, '_options', {
            value: Object.assign({}, defaults, options),
        });

    }

    static verifyOptions (options) {

        var requiredOptionKeys = [
            'baseDir',
        ];

        requiredOptionKeys.forEach((requiredOptionKey) => {

            if (requiredOptionKey in options) {
                return;
            }

            throw missingRequiredOptionError(requiredOptionKey);

        });

    }

    get baseDir () {
        return path.resolve(this._options.baseDir, '.');
    }

    get srcDir () {
        return path.resolve(this.baseDir, this._options.srcDir);
    }

    get etcDir () {
        return path.resolve(this.baseDir, this._options.etcDir);
    }

    get includeNpmXublits () {
        return this._options.includeNpmXublits;
    }

    get includeDirs () {

        var includeDirs = this._options.includeDirs.concat([
            this.srcDir,
        ]);

        if (true === this.includeNpmXublits) {
            includeDirs.push(
                path.join(this.baseDir, 'node_modules', 'xublit-*')
            );
        }

        return includeDirs;

    }

    set baseDir (newValue) {

        if (path.isAbsolute(newValue)) {
            this._options.baseDir = newValue;
            return;
        }

        throw new Error(
            'Invalid value for "baseDir" option - should be an absolute path'
        );

    }

    set srcDir (newValue) {
        this._options.srcDir = newValue;
    }

    set etcDir (newValue) {
        this._options.etcDir = newValue;
    }

}

function missingRequiredOptionError (optionName) {
    return new Error(util.format(
        'Missing "%s" option', optionName
    ));
}
