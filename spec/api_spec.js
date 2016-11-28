import * as Joi from 'joi';
import { IntacctApi } from '../index';
import { AuthControl } from '../src/auth_control';
import { ControlFunction } from '../src/control_function';
import { FUNCTION_NAMES } from '../src/constants';

describe('Public Interface', () => {
    function sessionApi() {
        return new IntacctApi({
            auth: {
                senderId: 'test',
                senderPassword: 'pass',
                sessionId: 'testSession'
            },
            controlId: 'cid'
        });
    }

    describe('Configure connection class', () => {
        it('handles initiation with session auth', () => {
            const obj = new IntacctApi({
                auth: {
                    senderId: 'test',
                    senderPassword: 'pass',
                    sessionId: 'testSession'
                }
            });

            expect(obj.auth).toEqual(jasmine.any(AuthControl));
            expect(obj).toEqual(jasmine.objectContaining({
                auth: jasmine.objectContaining({
                    senderId: 'test',
                    senderPassword: 'pass',
                    sessionId: 'testSession'
                }),
                uniqueId: false,
                dtdVersion: '3.0'
            }));

            const result = Joi.validate(obj.controlId, Joi.string().uuid());
            expect(result.error).toBeNull();
        });

        it('handles initiation with login auth', () => {
            const obj = new IntacctApi({
                auth: {
                    senderId: 'test',
                    senderPassword: 'pass',
                    companyId: 'company',
                    userId: 'user',
                    password: 'pass'
                },
                controlId: 'cid'
            });

            expect(obj).toEqual(jasmine.objectContaining({
                auth: jasmine.objectContaining({
                    companyId: 'company',
                    userId: 'user',
                    password: 'pass'
                }),
                controlId: 'cid'
            }));
        });

        it('handles configuration errors and throws appropriately', () => {
            function container() {
                // eslint-disable-next-line no-unused-vars
                const obj = new IntacctApi({
                    auth: {
                        senderId: 'test',
                        senderPassword: 'pass',
                        userId: 'user',
                        sessionId: 'session'
                    }
                });
            }

            expect(container).toThrow();
        });
    });

    describe('FunctionControl factory methods', () => {
        FUNCTION_NAMES.forEach((name) => {
            it(`exposes ${name}`, () => {
                expect(IntacctApi[name]).toEqual(jasmine.any(Function));

                const control = IntacctApi[name]({});

                expect(control).toEqual(jasmine.any(ControlFunction));
                expect(control.name).toBe(name);
            });
        });
    });

    describe('Request Body generation', () => {
        it('should properly generate', () => {
            const obj = sessionApi();

            const xml = obj.createRequestBody([
                IntacctApi.create({ key1: 'val1' }, 'id1'),
                IntacctApi.update({ key2: 'val2' }, 'id2')
            ]);

            // confirm structure
            expect(xml).toMatch(/<\?xml.+\?><request><control>.+<\/control><operation><authentication>.+<\/authentication><content>.+<\/content><\/operation><\/request>/);

            // verify functions
            expect(xml).toMatch('<function controlid="id1"><create><key1>val1</key1></create></function>');
            expect(xml).toMatch('<function controlid="id2"><update><key2>val2</key2></update></function>');
        });

        it('should properly generate with a single control function', () => {
            const obj = sessionApi();

            const xml = obj.createRequestBody(IntacctApi.create({ key1: 'val1' }, 'id1'));

            expect(xml).toMatch('<function controlid="id1"><create><key1>val1</key1></create></function>');
        });

        it('should properly throw an error if given a non control function', () => {
            function shouldFailSingle() {
                const obj = sessionApi();
                obj.createRequestBody({ notValid: true });
            }

            function shouldFailArray() {
                const obj = sessionApi();
                obj.createRequestBody([IntacctApi.read(), { notValid: true }]);
            }

            expect(shouldFailSingle).toThrow();
            expect(shouldFailArray).toThrow();
        });

        it('should generate with passwords redacted', () => {
            const obj = new IntacctApi({
                auth: {
                    senderId: 'test',
                    senderPassword: 'pass',
                    companyId: 'company',
                    userId: 'user',
                    password: 'pass'
                }
            });

            const xml = obj.createRequestBodyNoPasswords([]);

            expect(xml).not.toMatch(/<password>pass<\/password>/);
            expect(xml).toMatch(/.+<password>REDACTED<\/password>.+<password>REDACTED<\/password>.+/);
        });
    });
});
