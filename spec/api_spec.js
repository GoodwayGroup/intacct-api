import * as IntacctApi from '../';
import * as AuthControl from '../src/auth_control';

describe('Public Interface', () => {

    describe('Configure connection class', () => {

        it('handles initiation with proper configuration', () => {
            let obj = new IntacctApi({
                auth: {
                    sessionId: 'testSession'
                }
            });

            expect(obj.auth instanceof AuthControl).toBe(true);
            expect(obj.auth.sessionId).toBe('testSession');
        });
    });

    describe('Verify request authenication', () => {

        it('handles user login');

        it('handles session id');

        it('handles no authenication');
    });

    describe('Exposes factory methods for FunctionControl instances', () => {

        it('')
    });
});
