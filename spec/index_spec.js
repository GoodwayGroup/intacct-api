import { IntacctApi } from '../src/index';
import { ControlFunction } from '../src/control_function';

describe('IntacctApi', () => {
    it('has a readMore method', () => {
        expect(IntacctApi.readMore).toBeDefined();
    });

    describe('readMore', () => {
        it('should return a controlFunc', () => {
            const controlFunc = IntacctApi.readMore('params', 'controlId');
            expect(controlFunc.parameters).toBe('params');
            expect(controlFunc.controlId).toBe('controlId');
        });

        describe('passing in a control func', () => {
            const controlId = 'controlId';
            const resultId = '123';
            const controlFunc = new ControlFunction('readByQuery', {}, controlId);
            beforeEach(() => {
                controlFunc.data = {
                    $: { resultId }
                };
            });

            it('should return a new readMore control function with the result of the first', () => {
                controlFunc.isSuccessful = function () {
                    return true;
                };
                const outFunc = IntacctApi.readMore(controlFunc, controlId);
                expect(outFunc.name).toBe('readMore');
                expect(outFunc.controlId).toBe(controlId);
                expect(outFunc.parameters.resultId).toBe(resultId);
            });

            it('throw an error if the controlFunc has no resultId', () => {
                controlFunc.data.$.resultId = null;
                expect(() => {
                    IntacctApi.readMore(controlFunc, controlId);
                }).toThrow();
            });
            it('throw an error if the controlFunc is not in a success state', () => {
                controlFunc.isSuccessful = function () {
                    return false;
                };
                expect(() => {
                    IntacctApi.readMore(controlFunc, controlId);
                }).toThrow();
            });
        });
    });
});
