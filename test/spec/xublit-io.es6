import XublitApp from '../../src/xublit-io';

describe('XublitApp', () => {

    var xublitApp;

    beforeEach(() => {
        xublitApp = new XublitApp({
            baseDir: __dirname,
        });
    });

    describe('emit()', () => {
        it('should throw an error when called', () => {
            expect(function () {
                xublitApp.emit('someEvent');
            }).toThrowError('No.');
        });
    });

});