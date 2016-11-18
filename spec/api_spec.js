import { IntacctApi } from '../index';
import { AuthControl } from '../src/auth_control';
import { ControlFunction } from '../src/control_function';

describe('Public Interface', () => {
    describe('Configure connection class', () => {
        it('handles initiation with session auth', () => {
            const obj = new IntacctApi({
                auth: {
                    senderId: 'test',
                    senderPassword: 'pass',
                    sessionId: 'testSession'
                }
            });

            expect(obj.auth instanceof AuthControl).toBe(true);
            expect(obj.auth.senderId).toBe('test');
            expect(obj.auth.senderPassword).toBe('pass');
            expect(obj.auth.sessionId).toBe('testSession');
        });

        it('handles initiation with login auth', () => {
            const obj = new IntacctApi({
                auth: {
                    senderId: 'test',
                    senderPassword: 'pass',
                    companyId: 'company',
                    userId: 'user',
                    password: 'pass'
                }
            });

            expect(obj.auth.companyId).toBe('company');
            expect(obj.auth.userId).toBe('user');
            expect(obj.auth.password).toBe('pass');
        });
    });

    describe('Verify request authenication', () => {
        it('handles user login');

        it('handles session id');

        it('handles no authenication');
    });

    describe('FunctionControl factory methods', () => {
        function testFactory(name) {
            return () => {
                expect(IntacctApi[name] instanceof Function).toBe(true);

                const control = IntacctApi[name]({});

                expect(control instanceof ControlFunction).toBe(true);
            };
        }

        it('exposes update', testFactory('update'));
    });
});
