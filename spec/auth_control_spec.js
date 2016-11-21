import * as xmlbuilder from 'xmlbuilder';
import { AuthControl } from '../src/auth_control';

describe('Auth Control class', () => {
    function session() {
        return new AuthControl({
            senderId: 'sender',
            senderPassword: 'pass',
            sessionId: 'id'
        });
    }

    function login() {
        return new AuthControl({
            senderId: 'sender',
            senderPassword: 'pass',
            companyId: 'cid',
            userId: 'uid',
            password: 'pass'
        });
    }

    it('should assign proper variables with as session type', () => {
        const obj = session();

        expect(obj).toEqual(jasmine.any(AuthControl));
        expect(obj).toEqual(jasmine.objectContaining({
            senderId: 'sender',
            senderPassword: 'pass',
            sessionId: 'id',
            authType: 'session'
        }));
    });

    it('should assign proper variables with as login type', () => {
        const obj = login();

        expect(obj).toEqual(jasmine.objectContaining({
            senderId: 'sender',
            senderPassword: 'pass',
            authType: 'login',
            companyId: 'cid',
            userId: 'uid',
            password: 'pass'
        }));
    });

    it('should construct xml with session type', () => {
        const obj = session();
        const root = xmlbuilder.begin();
        const xml = obj.toXML(root).end();

        expect(xml).toEqual('<authenication><sessionid>id</sessionid></authenication>');
    });

    it('should construct xml with login type', () => {
        const obj = login();
        const root = xmlbuilder.begin();
        const xml = obj.toXML(root).end();

        expect(xml).toMatch(/<authenication><login>.*<\/login><\/authenication>/);
        expect(xml).toMatch(/<userid>uid<\/userid>/);
        expect(xml).toMatch(/<companyid>cid<\/companyid>/);
        expect(xml).toMatch(/<password>pass<\/password>/);
    });
});
