/// <reference path="../CORE/Xr.ts" />
/// <reference path="../CORE/Strings.ts" />
/// <reference path="JWT.ts" />


namespace mz.oauth2 {
    export interface IRoleChecker {
        (role: string): boolean;
    }

    export var roleList: string[] = [];

    var loginUrl = null;
    var refreshTokenUrl = null;
    var logoutUrl = null;
    var clientSecret: string = null;
    var xhrWithCredentials = null;

    var scopes = [];

    export var currentDomain = extractDomain(location.href), currentClientID = 'mz-core';

    function extractDomain(url): string {
        var domain;

        var partes = url.split('/');
		
        //find & remove protocol (http, ftp, etc.) and get domain
        if (url.indexOf("://") > -1) {
            domain = partes[2];
        } else {
            if (partes[0].contains('.'))
                domain = partes[0];
            else
                return currentDomain;
        }
	
        //find & remove port number
        domain = domain.split(':')[0];

        return domain.toLowerCase();
    }

    export function tokenGetter(domain: string): { token: string; type: string; } {
        return {
            token: localStorage.getItem('JWT_' + domain) || localStorage.getItem('JWT_' + currentDomain) || null,
            type: localStorage.getItem('JWTtype_' + domain) || 'bearer'
        }
    }

    function setupToken(token: string) {
        if (mz.auth.jwt.isTokenExpired(token, 0))
            throw new Error("The provided token is expired");

        let decodedToken = mz.auth.jwt.decodeToken(token);
        if (decodedToken.role && decodedToken.role.length) {
            if (typeof decodedToken.role == "string")
                decodedToken.role = [decodedToken.role];
            pushRoles(decodedToken.role);
        }
    }

    export function setToken(domain: string, token?: string, refreshToken?: string, tokenType?: string) {
        domain = domain.toLowerCase();
        if (token) {
            if (mz.auth.jwt.isTokenExpired(token, 0))
                throw new Error("The provided token is expired");


            if (domain == currentDomain) {
                setupToken(token);
            }

            localStorage.setItem('JWT_' + domain, token);
            localStorage.setItem('JWTr_' + domain, refreshToken);
            localStorage.setItem('JWTtype_' + domain, (tokenType || 'bearer'));

        } else {
            localStorage.removeItem('JWT_' + domain);
            localStorage.removeItem('JWTr_' + domain);
            localStorage.removeItem('JWTtype_' + domain);

        }
    }

    export function checkRole(role: string): boolean {
        return roleList.indexOf(role) != -1;
    }

    export function pushRoles(roles: string[] | string) {
        let roleArray: string[] = <any>roles;

        if ((<any>roleList) instanceof String) roleArray = (<any>roleList).split(/[\|,]/g);

        roleArray.forEach(role => roleList.indexOf(role) == -1 && roleList.push(role))
    }

	
    /// <reference path="../CORE/Xr.ts" />
    /// <reference path="../CORE/Strings.ts" />
    /// <reference path="JWT.ts" />


    var ERROR_RESPONSES = {
        'invalid_request': [
            'The request is missing a required parameter, includes an',
            'invalid parameter value, includes a parameter more than',
            'once, or is otherwise malformed.'
        ].join(' '),
        'invalid_client': [
            'Client authentication failed (e.g., unknown client, no',
            'client authentication included, or unsupported',
            'authentication method).'
        ].join(' '),
        'invalid_grant': [
            'The provided authorization grant (e.g., authorization',
            'code, resource owner credentials) or refresh token is',
            'invalid, expired, revoked, does not match the redirection',
            'URI used in the authorization request, or was issued to',
            'another client.'
        ].join(' '),
        'unauthorized_client': [
            'The client is not authorized to request an authorization',
            'code using this method.'
        ].join(' '),
        'unsupported_grant_type': [
            'The authorization grant type is not supported by the',
            'authorization server.'
        ].join(' '),
        'access_denied': [
            'The resource owner or authorization server denied the request.'
        ].join(' '),
        'unsupported_response_type': [
            'The authorization server does not support obtaining',
            'an authorization code using this method.'
        ].join(' '),
        'invalid_scope': [
            'The requested scope is invalid, unknown, or malformed.'
        ].join(' '),
        'server_error': [
            'The authorization server encountered an unexpected',
            'condition that prevented it from fulfilling the request.',
            '(This error code is needed because a 500 Internal Server',
            'Error HTTP status code cannot be returned to the client',
            'via an HTTP redirect.)'
        ].join(' '),
        'temporarily_unavailable': [
            'The authorization server is currently unable to handle',
            'the request due to a temporary overloading or maintenance',
            'of the server.'
        ].join(' ')
    }


    var unauthorizedRetry = (fn) => {
        return <Promise<mz.xr.XrResponse>>(new Promise<mz.xr.XrResponse>(fn)).catch(err => {
            if (err.status == 401) {
                return oauth2.refreshToken().then(
                    x => new Promise(fn),
                    x => {
                        if (x && x.status == 401) {
                            oauth2.emit('unauthorized');
                        }
                        return Promise.reject(x);
                    });
            }
            return Promise.reject(err);
        });
    };

    var handleError = (x) => {
        var err = x;
        if (x && x.data && x.data.error) {
            var message = ERROR_RESPONSES[x.data.error] || x.data.error_message || x.data.error;

            oauth2.emit('error', 'refreshToken', x.data, message);
            if (x.data.error == "invalid_grant") {
                localStorage.removeItem('JWTr_' + currentDomain);
                // must login
                oauth2.emit('unauthorized');
            }

            err = new Error(message);

            err.name = x.data.error;
        }

        if (x.status == 401) {
            oauth2.emit('unauthorized');
        }

        return Promise.reject(err);
    };

    export function applyAuthorizationHeaders(xr: xr.IXrArgs) {
        let domain = extractDomain(xr.url)
        let token = tokenGetter(domain);
        if (token.token) {
            xr.headers = xr.headers || {};

            if (token.type == "bearer") {
                xr.headers['Authorization'] = "Bearer " + token.token;
            } else {
                (xr.params = xr.params || {})["access_token"] = token.token;
                xr.headers['Pragma'] = 'no-store';
                xr.headers['Cache-Control'] = 'no-store';
            }

            xr.promise = unauthorizedRetry;
        }
    }

    export function configure(opts: {
        loginUrl?: string;
        refreshTokenUrl?: string;
        logoutUrl?: string;
        clientSecret?: string;
        clientId: string;
        scopes?: string[];
        xhrWithCredentials?: boolean;
    }) {
        loginUrl = opts.loginUrl || null;
        refreshTokenUrl = opts.refreshTokenUrl || null;
        logoutUrl = opts.logoutUrl || null;
        currentClientID = opts.clientId || null;
        clientSecret = opts.clientSecret || null;
        scopes = opts.scopes || [];
        xhrWithCredentials = opts.xhrWithCredentials;


        if (localStorage.getItem('JWT_' + currentDomain)) {
            try {
                setupToken(localStorage.getItem('JWT_' + currentDomain));
            } catch (e) {
                console.error(e);
            }
        }

        if (localStorage.getItem('JWTr_' + currentDomain)) {
            refreshTokenUrl && refreshToken();
        }
    }

    export function refreshToken(): Promise<xr.XrResponse> {
        if (refreshTokenUrl) {
            let authString;
            if (currentClientID) {
                authString = currentClientID + ':';
                if (clientSecret)
                    authString += clientSecret;
                authString = 'Basic ' + btoa(authString);
            }

            return mz.xr.post(refreshTokenUrl,
                {
                    grant_type: "refresh_token",
                    refresh_token: localStorage.getItem('JWTr_' + currentDomain) || null
                }, {
                    skipAuthorization: true,
                    dump: xr.formatters.urlEncoded,
                    headers: {
                        Authorization: authString
                    },
                    withCredentials: xhrWithCredentials
                }).then(x => {
                    if (x.data.access_token) {
                        oauth2.emit("gotToken", x.data.token, x.data, currentDomain)
                        setToken(currentDomain, x.data.access_token, x.data.refresh_token || null);
                    }
                    if (x.data.error) {
                        var message = ERROR_RESPONSES[x.data.error] || x.data.error_message || x.data.error;

                        oauth2.emit('error', 'refreshToken', x.data, message);
                        if (x.data.error == "invalid_grant") {
                            localStorage.removeItem('JWTr_' + currentDomain);
                            // must login
                        }

                        var err = new Error(message);

                        err.name = x.data.error;

                        return Promise.reject(err);
                    }
                    return x;
                }, handleError);
        }
        return Promise.reject(null);
    }

    export function logout(): Promise<xr.XrResponse> {
        setToken(currentDomain, null);

        oauth2.emit('logout');

        if (logoutUrl) {
            return mz.xr.get(logoutUrl, {}, {
                skipAuthorization: true,
                withCredentials: xhrWithCredentials
            }).then(x => {
                return x;
            });
        }
        return Promise.resolve(null);
    }



    export function login(username: string, password: string): Promise<xr.XrResponse> {
        if (loginUrl) {

            var authString;

            if (currentClientID) {
                authString = currentClientID + ':';
                if (clientSecret)
                    authString += clientSecret;
                authString = 'Basic ' + btoa(authString);
            }

            var theScopes: string = void 0;

            if (scopes.length) {
                theScopes = scopes.join(' ');
            }

            return mz.xr.post(loginUrl,
                {
                    grant_type: 'password',
                    username: username,
                    password: password,
                    scope: theScopes
                },
                {
                    skipAuthorization: true,
                    dump: xr.formatters.urlEncoded,
                    headers: {
                        Authorization: authString
                    },
                    withCredentials: xhrWithCredentials
                }).then(x => {
                    if (x.data.access_token) {
                        setToken(currentDomain, x.data.access_token, x.data.refresh_token || null, (x.data.token_type || '').toLowerCase());
                    } else if (x.data.error) {

                        var message = ERROR_RESPONSES[x.data.error] || x.data.error_message || x.data.error;
                        var err = new Error(message);
                        err.name = x.data.error;
                        return Promise.reject(err);
                    }

                    oauth2.emit('login', x.data);

                    return x;
                }, handleError);
        }
        return Promise.reject(null);
    }

    export function loggedIn(): boolean {
        var token = tokenGetter(currentDomain);
        if (!token || !token.token) return false;

        try {
            return !mz.auth.jwt.isTokenExpired(token.token);
        } catch (e) {
            console.error(e)
        }

        return false;
    }

    export var on = mz.EventDispatcher.prototype.on;
    export var emit = mz.EventDispatcher.prototype.emit;
    export var off = mz.EventDispatcher.prototype.off;

    mz.EventDispatcher.apply(oauth2);
    (<any>mz).eventDispatcher.prototype.init.apply(oauth2);
}