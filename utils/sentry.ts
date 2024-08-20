import * as Sentry from "@sentry/browser";
import $ from 'jquery';

export class Stats {
    // private static scriptURL: URL = new URL('https://js.sentry-cdn.com/7b6fb95f0ee3ee7ad311199c8728b3b9.min.js');

    public static init = async () => {

        Sentry.init({
            dsn: "https://7b6fb95f0ee3ee7ad311199c8728b3b9@o4507734081601536.ingest.us.sentry.io/4507734087434240",
            integrations: [
                Sentry.replayIntegration({
                    maskAllText: false,
                    blockAllMedia: false
                }),
                Sentry.browserProfilingIntegration(),
                Sentry.browserTracingIntegration(),
                Sentry.sessionTimingIntegration(),
                Sentry.browserApiErrorsIntegration(),
                Sentry.httpClientIntegration(),
                Sentry.linkedErrorsIntegration(),
                Sentry.globalHandlersIntegration(),
                Sentry.reportingObserverIntegration(),
                Sentry.dedupeIntegration(),
                Sentry.httpContextIntegration(),
                Sentry.zodErrorsIntegration(),
                Sentry.extraErrorDataIntegration(),
            ],
            // Session Replay
            replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
            replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
        });
        // this.testError();
    }

    private static testError = () => {
        const errorScript = $('<script></script>').text('myUndefinedFunction();');
        // same as document.head
        $('head').append(errorScript);
    }
}
