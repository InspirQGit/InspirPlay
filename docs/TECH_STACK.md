# InspirQ Technology Stack

## Web application

- **React 19** for the component and interaction layer.
- **Next.js 16** for routing, server rendering, route handlers, and the Node.js runtime.
- **Tailwind CSS 4** and the existing InspirQ component primitives for presentation.
- **Storybook** is the isolated component workshop for UI documentation, accessibility checks, and interaction review.
- Semantic HTML and standards-based CSS remain the foundation beneath React and Tailwind.

## Backend and data

- **Node.js** hosts the Next.js application, authentication endpoints, integrations, and server-side workflows.
- **Payload CMS** provides the application backend, admin tooling, public-user records, access control, and structured content.
- **PostgreSQL** is the target relational datastore supplied through the Figma-managed Payload runtime. Database credentials and adapters remain platform-managed.

## Authentication

- **Auth.js** provides Google, Facebook, and application sessions.
- **Twilio Verify** provides email and SMS one-time-password delivery and verification.
- Public app users live in the separate Payload `users` collection and never receive Payload Admin access.

## Mobile applications

- **React Native** is the target shared mobile client for iOS and Android.
- Mobile clients should consume versioned Node.js API contracts and use the same public app-user identity model.
- Native application packaging, push-notification credentials, deep links, and store deployment remain a later delivery phase.

## AI services

- **Python** is the target runtime for recommendation, classification, forecasting, and other AI workloads.
- AI services should be isolated behind authenticated server-to-server APIs or background jobs.
- Model-provider keys and private data must stay in server environments; browser and mobile clients call the Node.js backend rather than Python services directly.

## Integration boundaries

1. React and React Native clients call the Node.js application API.
2. Node.js applies authentication, authorization, validation, and ownership rules.
3. Payload persists durable records in PostgreSQL.
4. Node.js invokes Python AI services using narrowly scoped service credentials.
5. Provider secrets are added through Make environment settings only when the integration phase begins.
