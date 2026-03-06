// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Sentry.init({
//   dsn: "https://135a161621cb17aceaaf997a5a86d46a@o4510993364746240.ingest.de.sentry.io/4510993377984592",

//   // Add optional integrations for additional features
//   integrations: [Sentry.replayIntegration()],

//   // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
//   tracesSampleRate: 1,
//   // Enable logs to be sent to Sentry
//   enableLogs: true,

//   // Define how likely Replay events are sampled.
//   // This sets the sample rate to be 10%. You may want this to be 100% while
//   // in development and sample at a lower rate in production
//   replaysSessionSampleRate: 0.1,

//   // Define how likely Replay events are sampled when an error occurs.
//   replaysOnErrorSampleRate: 1.0,

//   // Enable sending user PII (Personally Identifiable Information)
//   // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
//   sendDefaultPii: true,
// });


Sentry.init({
  dsn: "https://135a161621cb17aceaaf997a5a86d46a@o4510993364746240.ingest.de.sentry.io/4510993377984592",

  integrations: [
    Sentry.replayIntegration(),
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});


export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
