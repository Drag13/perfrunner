We all know the Hotjar - a great tool to understand how the users interact with your site. However, Hotjar requires running some scripts (and not only) to work correctly, as a result, but some security concerns also arise.

If you are using Content-Security-Policy to make your site more secure, you`ll find that you need to add some exceptions for your CSP rule. The documentation states that we need to apply the next rules

> `img-src` https://script.hotjar.com http://script.hotjar.com;

> `script-src` http://static.hotjar.com https://static.hotjar.com https://script.hotjar.com 'unsafe-eval' 'unsafe-inline';

> `connect-src` http://*.hotjar.com:* https://*.hotjar.com:* https://vc.hotjar.io:* wss://\*.hotjar.com;

> `frame-src` https://vars.hotjar.com;

> `font-src` http://script.hotjar.com https://script.hotjar.com;

If you spend a bit of time you will see that the Hotjar requires:

-   Allow HTTP connection for img-src, script-src, conntect-src and font-src. This is a big security concern because HTTP traffic can be viewed and modified by a 3rd party, which is actually a security breach. It's clear that it was done to support those who have HTTP only, but in this case, the Hotjar should have stated this much more clearly instead of just alowing both of protocols.

-   Allow using 'unsafe-eval' and 'unsafe-inline' which is also a big security breach that can be exploited if someone finds a way to put malicious code there. You may argue that all code will be injected by the authorized person and we are safe, but take a look into the latest hijack history - sooner or later companies that keep valuable information will be hacked. Thus `unsafe-eval` brings real risks for us.

-   Allow two different domains (hotjar.io and hotjar.com) and some subdomains like script.hotjar.com, static.hotjar.com, vars.hotjar.com, and others. We all know that the more endpoints are open - the bigger the risk to be compromised is. This becomes even more dangerous when the unsafe-eval rule allowed. And about `connect-src` http://*.hotjar.com - it looks like a huge security risk because we allow sending our user's data to any subdomain that lives under hotjar.com domain. If at least one will be hacked, we are in trouble.

As you can see, there are some open questions regarding the amount and types of the permission we should grant to the 3rd party tool.

Of course, nobody says that the Hotjar does this for evil. It's really hard to keep the balance between security and simplicity. Some technical solutions might have existed for ages and it could be quite difficult to adapt it for better security. But right now, the permission that is required by the Hotjar brings more risks than value.

P.S. If anybody knows for what reason the Hotjar requires loading font permission - let me know!
