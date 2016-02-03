export var ref = 'someSingleton';
export var inject = ['XublitSomeModule'];
export function bootstrap (XublitSomeModule) {

    var testApp = this.app;

    class SomeSingleton extends XublitSomeModule {

        constructor () {

            super();

            testApp.onceStarted(() => {
                this.connectToSomething();
            });

        }

        connectToSomething () {
            setTimeout(() => {
                this.emit('connected');
            }, 100);
        }

    }

    return SomeSingleton;

}
