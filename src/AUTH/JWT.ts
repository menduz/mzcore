/// <reference path="../mz.ts" />

namespace mz.auth.jwt {
      export function urlBase64Decode(str) {
            var output = str.replace(/-/g, '+').replace(/_/g, '/');
            switch (output.length % 4) {
                  case 0: { break; }
                  case 2: { output += '=='; break; }
                  case 3: { output += '='; break; }
                  default: {
                        throw 'Illegal base64url string!';
                  }
            }
            return mz.globalContext.decodeURIComponent(mz.globalContext.escape(mz.globalContext.atob(output))); //polyfill https://github.com/davidchambers/Base64.js
      }

      export function decodeToken(token) {
            var parts = token.split('.');

            if (parts.length !== 3) {
                  throw new Error('JWT must have 3 parts');
            }

            var decoded = urlBase64Decode(parts[1]);
            if (!decoded) {
                  throw new Error('Cannot decode the token');
            }

            return JSON.parse(decoded);
      }

      export function getTokenExpirationDate(token) {
            var decoded = decodeToken(token);

            if (typeof decoded.exp === "undefined") {
                  return null;
            }

            var d = new Date(0); // The 0 here is the key, which sets the date to the epoch
            d.setUTCSeconds(decoded.exp);

            return d;
      };

      export function isTokenExpired(token: string, offsetSeconds?: number): boolean {
            var d = getTokenExpirationDate(token);
            offsetSeconds = offsetSeconds || 0;
            if (d === null) {
                  return false;
            }

            // Token expired?
            return !(d.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
      };
}