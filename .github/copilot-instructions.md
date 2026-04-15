# Local Instructions

## Local-only handling

- This file is stored in the git repo. Do not copy it into `clipsphere-api/`, duplicate it elsewhere in the repository, or reference it from commits, PR text, issues, docs, comments, workflows, or release notes unless repository policy is intentionally being updated.
- Treat `agent_ready/SWAPD352_Web_Dev_Project (1)/document.md` as the primary project spec. Use `agent_ready/SWAPD352_Web_Dev_Project (1)/chunks.jsonl` for targeted lookup by section or topic.
- Use the document-pack `README.md` and `manifest.json` only to understand pack structure and retrieval flow. The `*_content_list.json`, `*_model.json`, and `*_middle.json` files are extraction metadata, not the primary authoring source.

## Visibility and attribution rules

- Do not mention drafting method, production origin, or authorship provenance anywhere in the repository or any repo-facing artifact.
- Do not add comments, docs, code annotations, banners, commit messages, PR text, release notes, trailers, signatures, or provenance notes about how the work was produced.
- Do not add any co-authored-by trailer, outside attribution, or self-reference to commits or repository files.
- The repository should contain only project content and project documentation.

## Commands

- Current backend implementation in `clipsphere-api/`: `npm run dev`, `npm run deps:up`, `npm run dev:with-deps`, `npm run docs:build`, `npm run test:seed`, and `npm test`.
- Run a single Newman request from `clipsphere-api/` with: `npx newman run postman/ClipSphere_Phase1_Final.postman_collection.json -e "postman/ClipSphere Local.postman_environment.json" --env-var baseUrl=http://localhost:5000 --folder "Health Check"`. `--folder` also accepts exact collection folders such as `Auth`, `Users`, `Videos`, and `Admin`.
- `npm test` is destructive to the local test database because it drops MongoDB before seeding the admin test user.
- Spec-level verification targets from `document.md`: Phase 1 is verified with Postman before any frontend exists; Swagger must be reachable at `http://localhost:5000/api-docs`; the Phase 2 frontend target is `http://localhost:3000`; the local MinIO console target is `http://localhost:9001`; Phase 3 expects Stripe CLI webhook listening for `checkout.session.completed`; the Phase 4 end-state is a single `docker-compose up` with Nginx exposing the system through `http://clipsphere.local`.

## High-level architecture

- The project is defined as a phased full-stack system: **Phase 1** builds the Express/MongoDB security and data foundations, **Phase 2** adds the Next.js App Router frontend and MinIO media pipeline, **Phase 3** adds Socket.io real-time flows and Stripe tipping, and **Phase 4** containerizes the whole stack with Docker Compose, Redis/Bull workers, and an Nginx gateway.
- The core topology in the spec is: Next.js frontend + Express API + MongoDB primary data store + MinIO S3-compatible media storage + Redis/Bull background processing + Nginx as the single public entry point. Later work should preserve this big-picture system shape even if the current repo only implements part of it.
- Phase dependencies matter. Later features explicitly build on earlier backend contracts: frontend auth depends on `/api/v1/users/me`, the admin dashboard depends on the Phase 1 admin stats and health endpoints, the discovery feeds depend on Phase 1 pagination and aggregation work, and the final DevOps phase assumes the whole stack can be routed behind one gateway.
- The data model revolves around Users, Videos, Reviews, Followers, notification preferences, and later Transactions/real-time notifications. The bonus `trendingScore` flow extends the Video model and is meant to be updated incrementally from likes/reviews rather than by full recomputation.

## Key conventions

- Preserve the Phase 1 three-layer architecture from `document.md`: **Routes -> Controllers -> Services**, with separate `models/` and `middleware/` directories.
- Treat the Phase 1 backend rules as foundation requirements for all later phases: `.env`-driven config, centralized async error handling, consistent JSON error envelopes, request logging, `express-mongo-sanitize`, Zod validation for incoming POST/PATCH data, bcrypt hashing with salt factor 10, JWT auth with expiration, `protect` authentication middleware, and role-based `restrictTo(admin)` checks.
- Keep the RBAC nuance from the spec: ownership checks gate standard users; admins may bypass ownership for moderation/delete flows, but they should not generally edit user-owned profile data.
- Keep the schema constraints aligned with the document pack: unique username/email, `role` of `user` or `admin`, `active` plus `accountStatus` for moderation, video duration capped at 300 seconds, review uniqueness per `(user, video)`, follower uniqueness per `(followerId, followingId)` with self-follow prevention, and nested notification preferences for both `inApp` and `email` toggles.
- Preserve the phase-coupled media pipeline rules: uploaded videos must be validated for type/size, probed with ffmpeg for the 5-minute cap, stored through MinIO/S3 integration, and only written back to MongoDB with an object key after upload succeeds.
- Keep feed and analytics behavior aligned with the spec: discovery uses paginated `limit`/`skip`, "Following" and "Trending" are separate feed concepts, admin stats must aggregate across collections, and moderation must account for both flagged and low-rated videos.
