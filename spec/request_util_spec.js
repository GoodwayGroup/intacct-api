import * as xmlbuilder from 'xmlbuilder';
import { IntacctApi } from '../index';
import * as requestUtil from '../src/request';

describe('Request Utilities', () => {
    it('Create control portion of request xml', () => {
        const obj = new IntacctApi({
            auth: {
                senderId: 'test',
                senderPassword: 'pass',
                sessionId: 'testSession'
            },
            controlId: 'cid'
        });
        const root = xmlbuilder.begin();
        const xml = requestUtil.createControl(obj, root).end();

        expect(xml).toMatch(/<control>.*<\/control>/);
        expect(xml).toMatch(/<senderid>test<\/senderid>/);
        expect(xml).toMatch(/<password>pass<\/password>/);
        expect(xml).toMatch(/<controlid>cid<\/controlid>/);
        expect(xml).toMatch(/<uniqueid>false<\/uniqueid>/);
        expect(xml).toMatch(/<dtdversion>3.0<\/dtdversion>/);
        expect(xml).toMatch(/<includewhitespace>false<\/includewhitespace>/);
    });

    describe('#createHashOfControlFunctions', () => {
        it('should create hash', () => {
            const func = IntacctApi.create({ param: true }, 'cid1');
            const hash = requestUtil.createHashOfControlFunctions([
                IntacctApi.create({ param: true }, 'cid1')
            ]);

            expect(hash).toEqual(jasmine.objectContaining({
                cid1: func
            }));
        });

        it('should create hash with non array parameter', () => {
            const func = IntacctApi.create({ param: true }, 'cid1');
            const hash = requestUtil.createHashOfControlFunctions(func);

            expect(hash).toEqual(jasmine.objectContaining({
                cid1: func
            }));
        });

        it('should throw error on duplicate control ids', () => {
            function container() {
                // eslint-disable-next-line no-unused-vars
                const hash = requestUtil.createHashOfControlFunctions([
                    IntacctApi.create({ param: true }, 'cid1'),
                    IntacctApi.update({ param: true }, 'cid1')
                ]);
            }

            expect(container).toThrowError(/duplicate/i);
        });

        it('should throw error on non-control function', () => {
            function container() {
                // eslint-disable-next-line no-unused-vars
                const hash = requestUtil.createHashOfControlFunctions([
                    IntacctApi.create({ param: true }, 'cid1'),
                    { param: true }
                ]);
            }

            expect(container).toThrowError(/invalid/i);
        });
    });
});
