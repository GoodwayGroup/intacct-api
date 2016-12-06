import * as Joi from 'joi';
import * as xmlbuilder from 'xmlbuilder';
import { ControlFunction } from '../src/control_function';

describe('ControlFunction class', () => {
    it('should assign proper variables', () => {
        const obj = new ControlFunction('test', {
            param: true
        }, 'controlid');

        expect(obj).toEqual(jasmine.any(ControlFunction));
        expect(obj.name).toBe('test');
        expect(obj.parameters).toEqual({ param: true });
        expect(obj.controlId).toBe('controlid');
    });

    it('should assign control id', () => {
        const obj = new ControlFunction('test', {}, 'controlid');

        expect(obj.controlId).toBe('controlid');
        obj.assignControlId('nextcontrolid');
        expect(obj.controlId).toBe('nextcontrolid');
    });

    it('should assign a uuid control id', () => {
        const obj = new ControlFunction('test', {});
        const result = Joi.validate(obj.controlId, Joi.string().uuid());

        expect(result.error).toBeNull();
    });

    it('should construct proper xml object for builder', () => {
        const obj = new ControlFunction('test', { param: true });
        const root = xmlbuilder.begin();

        const result = obj.toXML(root);
        const xml = result.end();

        expect(xml).toMatch(`<function controlid="${obj.controlId}"><test><param>true</param></test></function>`);
    });

    it('should error when no name is given', () => {
        const container = function container() {
            const obj = new ControlFunction();
            expect(obj).toBeNull(); // this assertion should never run
        };

        expect(container).toThrow();
    });

    it('#isSuccessful() === true', () => {
        const obj = new ControlFunction('test');

        obj.result = { status: 'success' };

        expect(obj.isSuccessful()).toBe(true);
    });

    it('#isSuccessful() === false', () => {
        const obj = new ControlFunction('test');

        expect(obj.isSuccessful()).toBe(false);

        obj.result = { status: 'failure' };

        expect(obj.isSuccessful()).toBe(false);
    });

    it('#get()', () => {
        const obj = new ControlFunction('test');
        const data = { prop: 'val' };

        obj.data = data;

        expect(obj.get()).toBe(data);
    });

    it('#get(\'prop.subprop\')', () => {
        const obj = new ControlFunction('test');
        const data = { prop: { subprop: 'val' } };

        obj.data = data;

        expect(obj.get('prop.subprop')).toEqual('val');
    });

    it('#process() with parse', () => {
        const obj = new ControlFunction('test');
        obj.parse = result => result;

        spyOn(obj, 'parse').and.callThrough();

        obj.process({
            status: ['success'],
            function: ['test'],
            controlid: [obj.controlId],
            data: {
                prop: 'val'
            }
        });

        expect(obj.parse).toHaveBeenCalledTimes(1);
        expect(obj.result).toEqual(jasmine.objectContaining({
            status: 'success',
            function: 'test',
            controlid: obj.controlId
        }));
    });

    it('#process() with no parse');
    it('#process() with error');
});
