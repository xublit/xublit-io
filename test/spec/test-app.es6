import * as path from 'path';

import XublitApp from '../../src/xublit-io';
import TestApp from '../test-app/test-app';

describe('Xublit Test App', () => {

    var testApp;

    beforeEach(() => {
        testApp = new TestApp();
    });

    describe('options', () => {

        it('should have correct value for "baseDir"', () => {
            expect(testApp.options.baseDir).toBe(path.resolve(__dirname, '../test-app'));
        });

        it('should have correct value for "includeNpmXublits"', () => {
            expect(testApp.options.includeNpmXublits).toBe(true);
        });

    });

    describe('includeDirs', () => {

        it('should have correct value for "includeDirs"', () => {
            expect(testApp.includeDirs).toEqual(jasmine.arrayContaining([
                path.resolve(__dirname, '../test-app/src'),
                path.resolve(__dirname, '../test-app/node_modules/xublit-*'),
            ]));
        });

    });

    describe('events', () => {

        var eventSpy;

        beforeEach(() => {
            eventSpy = jasmine.createSpy('eventSpy');
        });

        it('should emit an event "before:start" during start()', () => {

            testApp
                .on('before:start', eventSpy)
                .start();

            expect(eventSpy).toHaveBeenCalled();


        });

        it('should emit an event "bootstrapped" during start()', () => {

            testApp
                .on('bootstrapped', eventSpy)
                .start();

            expect(eventSpy).toHaveBeenCalled();


        });

        it('should emit an event "started" during start()', () => {

            testApp
                .on('started', eventSpy)
                .start();

            expect(eventSpy).toHaveBeenCalled();


        });

        it('should emit the start() events in the correct order', () => {

            var bindFns = {};

            bindFns.beforeStart = function () { };
            spyOn(bindFns, 'beforeStart').and.callThrough();

            bindFns.bootstrapped = function () {
                expect(bindFns.beforeStart).toHaveBeenCalled();
            };
            spyOn(bindFns, 'bootstrapped').and.callThrough();

            bindFns.started = function () {
                expect(bindFns.bootstrapped).toHaveBeenCalled();
            };
            spyOn(bindFns, 'started').and.callThrough();

            testApp
                .on('before:start', bindFns.beforeStart)
                .on('bootstrapped', bindFns.bootstrapped)
                .on('started', bindFns.started)
                .start();

            expect(bindFns.beforeStart).toHaveBeenCalled();


        });

    });

    describe('start()', () => {

        beforeEach(() => {
            testApp.start();
        });

    });

});