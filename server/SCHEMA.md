# MongoDB Schema Documentation

## Overview

This document outlines the MongoDB schema for the Pollman platform.

---

## User Schema

Stores authenticated user information via OAuth (Google & GitHub).

```
{
  _id: ObjectId,
  email: String (unique, required),
  name: String,
  googleId: String (optional),
  githubId: String (optional),
  avatar: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `email` (unique)
- `googleId`
- `githubId`

---

## Poll Schema

Main poll document containing metadata and question references.

```
{
  _id: ObjectId,
  title: String (required),
  description: String,
  createdBy: ObjectId (ref: User, required),
  questions: [ObjectId] (ref: Question),
  isAnonymous: Boolean (default: false),
  isPublished: Boolean (default: false),
  resultsPublished: Boolean (default: false),
  expiresAt: Date (optional),
  status: String (enum: 'active', 'expired', 'archived', default: 'active'),
  allowResultsPublish: Boolean (default: true),
  totalResponses: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `createdBy` (for "my polls" queries)
- `_id` (pollId)
- `expiresAt` (for expiry checks)
- `isPublished` (for public visibility)
- `status` (for filtering)
- `createdAt` (descending, for sorting)

---

## Question Schema

Individual questions within a poll (single-choice only).

```
{
  _id: ObjectId,
  pollId: ObjectId (ref: Poll, required),
  text: String (required),
  type: String (enum: ['single-choice'], default: 'single-choice'),
  options: [
    {
      _id: ObjectId (auto),
      text: String (required),
      count: Number (default: 0)
    }
  ],
  isRequired: Boolean (default: false),
  order: Number (for question ordering)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `pollId` + `order` (for fetching questions in order)
- `pollId`

---

## Response Schema

User responses to a poll.

```
{
  _id: ObjectId,
  pollId: ObjectId (ref: Poll, required),
  userId: ObjectId (ref: User, optional - null for anonymous),
  answers: [
    {
      questionId: ObjectId (ref: Question, required),
      selectedOption: String (required)
    }
  ],
  isAnonymous: Boolean (default: false),
  ipAddress: String (optional),
  userAgent: String (optional),
  completionPercentage: Number (0-100, default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `pollId` (for analytics queries)
- `userId` + `pollId` (prevent duplicate responses per user)
- `createdAt` (descending, for sorting)
- `pollId` + `createdAt` (for timeline analytics)

---

## PollAccessLog Schema (Optional)

Analytics log for poll interactions (auto-deletes after 90 days).

```
{
  _id: ObjectId,
  pollId: ObjectId (ref: Poll, required),
  userId: ObjectId (ref: User, optional),
  action: String (enum: 'view', 'respond', 'publish', 'edit', 'share', required),
  metadata: Mixed (optional),
  ipAddress: String (optional),
  userAgent: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `pollId`
- `userId`
- `pollId` + `createdAt` (for activity logs)
- `createdAt` (descending)
- `createdAt` (TTL: 90 days auto-delete)

---

## Relationships

```
User (1) ──→ (Many) Polls (createdBy)
Poll (1) ──→ (Many) Questions
Poll (1) ──→ (Many) Responses
Question (1) ──→ (Many) Responses (via answers.questionId)
User (1) ──→ (Many) Responses (for authenticated responses)
```

---

## Key Design Decisions

1. **Embedded options in Questions:** Options are embedded arrays (not separate documents) for simplicity and atomic updates.

2. **Denormalized response count:** `totalResponses` is stored on Poll for fast read without aggregation.

3. **Anonymous support:** Responses can be anonymous (`userId = null`) while still tracking ipAddress for duplicate-check.

4. **TTL on logs:** PollAccessLog auto-deletes after 90 days to prevent indefinite storage growth.

5. **Status field on Poll:** Simplifies queries for "active," "expired," "archived" without date logic on read.

6. **Flexible metadata:** PollAccessLog.metadata is Mixed type for custom event data in the future.

---

## Setup Instructions

1. **Local MongoDB:**

   ```
   mongod
   ```

2. **MongoDB Atlas:**
   Get connection string from: https://www.mongodb.com/cloud/atlas

   ```
   mongodb+srv://username:password@cluster.mongodb.net/pollman?retryWrites=true&w=majority
   ```

3. **Start server:**
   ```
   npm run server:dev
   ```
   Server will create indexes automatically on startup.
