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
});
