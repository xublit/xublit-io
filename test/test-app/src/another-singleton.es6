export var ref = 'anotherSingleton';
export var inject = ['someSingleton'];
export function bootstrap (someSingleton) {

    var testApp = this.app;

    class AnotherSingleton {

        constructor () {

            testApp.afterBootstrap(() => {
                this.listenForSomeSingletonConnect();
            });

        }

        listenForSomeSingletonConnect () {
            someSingleton.on('connected', () => {

                // DO NOT USE THIS IN REAL SITUATIONS
                // - It's only here for xublit-io test app purposes
                var psthf = process.singletonTestHelperFn || function () { };
                psthf('FOO');

            });
        }

    }

    return AnotherSingleton;

}
