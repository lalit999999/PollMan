# Poll APIs Implementation Guide

## Overview

Complete poll management system with create, read, update, delete, response submission, and analytics.

---

## Implemented Endpoints

### 1. Create Poll

**POST** `/api/polls`  
**Auth:** Required (JWT token)

Create a new poll with questions and options.

**Request Body:**

```json
{
  "title": "What's your favorite programming language?",
  "description": "Help us understand the community preferences",
  "questions": [
    {
      "text": "Which language do you prefer?",
      "options": [
        { "text": "JavaScript" },
        { "text": "Python" },
        { "text": "Go" },
        { "text": "Rust" }
      ],
      "isRequired": true
    }
  ],
  "isAnonymous": false,
  "expiresAt": "2024-12-31T23:59:59Z",
  "allowResultsPublish": true
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Poll created successfully",
  "data": {
    "_id": "poll_id",
    "title": "What's your favorite programming language?",
    "description": "Help us understand the community preferences",
    "createdBy": "user_id",
    "questions": [
      {
        "_id": "question_id",
        "pollId": "poll_id",
        "text": "Which language do you prefer?",
        "type": "single-choice",
        "options": [
          { "_id": "opt_id", "text": "JavaScript", "count": 0 },
          { "_id": "opt_id", "text": "Python", "count": 0 }
        ],
        "isRequired": true,
        "order": 0,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "isAnonymous": false,
    "isPublished": false,
    "resultsPublished": false,
    "expiresAt": "2024-12-31T23:59:59Z",
    "status": "active",
    "totalResponses": 0,
    "allowResultsPublish": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 2. Get Poll Details

**GET** `/api/polls/:id`  
**Auth:** Optional (for checking creator permissions)

Retrieve poll details with current response counts.

**Query Params:**

- None

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "poll_id",
    "title": "What's your favorite programming language?",
    "description": "...",
    "questions": [
      {
        "_id": "question_id",
        "text": "Which language do you prefer?",
        "options": [
          { "text": "JavaScript", "count": 5 },
          { "text": "Python", "count": 8 }
        ],
        "isRequired": true
      }
    ],
    "isAnonymous": false,
    "expiresAt": "2024-12-31T23:59:59Z",
    "totalResponses": 13,
    "resultsPublished": false,
    "status": "active"
  }
}
```

---

### 3. Update Poll

**PATCH** `/api/polls/:id`  
**Auth:** Required (only creator)

Update poll title, description, or questions. Can only edit if no responses exist.

**Request Body:**

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "questions": [
    {
      "text": "Updated question?",
      "options": [{ "text": "Option 1" }, { "text": "Option 2" }],
      "isRequired": true
    }
  ]
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Poll updated successfully",
  "data": {
    /* updated poll */
  }
}
```

---

### 4. Publish Poll Results

**POST** `/api/polls/:id/publish`  
**Auth:** Required (only creator)

Make poll results visible to public. Once published, anyone can view results.

**Request Body:** Empty

**Response (200):**

```json
{
  "success": true,
  "message": "Poll results published successfully",
  "data": {
    "_id": "poll_id",
    "resultsPublished": true,
    "/* ...rest of poll */ ": null
  }
}
```

---

### 5. Submit Poll Response

**POST** `/api/polls/:id/respond`  
**Auth:** Optional (depends on poll settings)

Submit answers to poll questions. Automatically validates:

- Poll is not expired ✓
- All required questions are answered ✓
- User hasn't already responded (if not anonymous) ✓

**Request Body:**

```json
{
  "answers": [
    {
      "questionId": "question_id",
      "selectedOption": "JavaScript"
    }
  ]
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Response submitted successfully",
  "data": {
    "_id": "response_id",
    "pollId": "poll_id",
    "userId": "user_id_or_null",
    "answers": [
      {
        "questionId": "question_id",
        "selectedOption": "JavaScript"
      }
    ],
    "isAnonymous": false,
    "completionPercentage": 100,
    "createdAt": "2024-01-15T10:35:00Z"
  }
}
```

**Error 400 Scenarios:**

- `"Poll has expired"` - expiresAt is in past
- `"You have already responded to this poll"` - duplicate response (authenticated)
- `"Question \"*\" is required"` - missing required answer
- `"At least one answer is required"` - empty answers array

---

### 6. Get Poll Analytics

**GET** `/api/polls/:id/analytics`  
**Auth:** Required (only creator)

Get detailed analytics including response breakdown, completion rates, and trends.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "pollId": "poll_id",
    "title": "What's your favorite programming language?",
    "totalResponses": 13,
    "completionRate": 92,
    "averageCompletion": 98,
    "expiresAt": "2024-12-31T23:59:59Z",
    "resultsPublished": false,
    "questionAnalytics": [
      {
        "questionId": "question_id",
        "text": "Which language do you prefer?",
        "isRequired": true,
        "totalResponses": 13,
        "options": [
          {
            "text": "JavaScript",
            "count": 5,
            "percentage": 38
          },
          {
            "text": "Python",
            "count": 8,
            "percentage": 62
          }
        ]
      }
    ],
    "recentResponses": [
      {
        "respondedAt": "2024-01-15T10:35:00Z",
        "completionPercentage": 100,
        "isAnonymous": false
      }
    ]
  }
}
```

---

## Additional Endpoints (To Be Implemented)

### Get User's Polls

**GET** `/api/polls/user/list`  
**Auth:** Required

Get all polls created by the authenticated user with pagination and filtering.

**Query Params:**

- `status` (optional): `active`, `expired`, `archived`
- `search` (optional): Search in title/description
- `sort` (optional): `-createdAt` (default), `createdAt`, `totalResponses`
- `page` (optional): Default 1
- `limit` (optional): Default 10

---

### Get Public Results

**GET** `/api/polls/:id/results`  
**Auth:** None required

Get published poll results. Only available if `resultsPublished` is true.

---

### Delete Poll

**DELETE** `/api/polls/:id`  
**Auth:** Required (only creator)

Delete poll and all associated responses.

---

## Business Logic Rules

### Expiry Validation

- ✓ Polls with `expiresAt` in past reject new responses
- ✓ Expired status is automatically set when checking poll

### Required Questions

- ✓ If question has `isRequired: true`, response must include it
- ✓ Server validates all required Qs are answered before accepting response

### Anonymous vs Authenticated

- ✓ If `isAnonymous: true`: userId is NOT stored (can respond multiple times with same IP)
- ✓ If `isAnonymous: false`: userId IS stored (one response per user)
- ✓ Server prevents duplicate responses for authenticated polls

### Response Validation

- ✓ All answers must have valid questionId
- ✓ selectedOption must exactly match option text in question
- ✓ Answers are validated against poll's question list

### Poll Editing

- ✓ Can only edit polls with 0 responses
- ✓ Cannot edit title/questions if responses exist
- ✓ Creator can always edit until first response

---

## Error Handling

### Common Error Responses

**400 Bad Request:**

```json
{
  "success": false,
  "message": "Poll title is required"
}
```

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "No token provided"
}
```

**403 Forbidden:**

```json
{
  "success": false,
  "message": "Not authorized to edit this poll"
}
```

**404 Not Found:**

```json
{
  "success": false,
  "message": "Poll not found"
}
```

**500 Internal Error:**

```json
{
  "success": false,
  "message": "Failed to create poll",
  "error": "Error details"
}
```

---

## Request Headers

All authenticated endpoints require:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## Frontend Integration

### Create Poll

```jsx
const createPoll = async (pollData) => {
  const response = await fetch("/api/polls", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pollData),
  });
  return response.json();
};
```

### Submit Response

```jsx
const submitResponse = async (pollId, answers) => {
  const response = await fetch(`/api/polls/${pollId}/respond`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answers }),
  });
  return response.json();
};
```

### Get Analytics

```jsx
const getAnalytics = async (pollId) => {
  const response = await fetch(`/api/polls/${pollId}/analytics`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
};
```

---

## Testing

### Using cURL

```bash
# Create poll
curl -X POST http://localhost:5000/api/polls \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}'

# Get poll
curl http://localhost:5000/api/polls/poll_id

# Submit response
curl -X POST http://localhost:5000/api/polls/poll_id/respond \
  -H "Content-Type: application/json" \
  -d '{"answers":[...]}'

# Get analytics
curl http://localhost:5000/api/polls/poll_id/analytics \
  -H "Authorization: Bearer TOKEN"
```

---

## Files Implemented

✅ `server/src/services/poll.service.js` - Core business logic  
✅ `server/src/controllers/poll.controller.js` - API handlers  
✅ `server/src/routes/poll.routes.js` - Route definitions  
✅ `server/src/services/polls.service.js` - List, filtering, validation  
✅ `server/src/controllers/polls.controller.js` - Additional handlers

---

## Integration Checklist

- [ ] Merge poll routes into `server/src/routes/index.js`
- [ ] Test all endpoints with Postman/cURL
- [ ] Connect frontend create poll form to POST /api/polls
- [ ] Connect frontend response form to POST /api/polls/:id/respond
- [ ] Connect frontend analytics dashboard to GET /api/polls/:id/analytics
- [ ] Add Socket.io real-time updates on response submission
- [ ] Implement pagination on user polls list

---

## Next: Socket.io Real-Time Updates

When response is submitted:

1. Emit `poll:response:new` to room `poll:<pollId>`
2. Emit `poll:analytics:update` to room `creator:<userId>`
3. Frontend listens and updates live counters

See [SOCKET_IO.md](./SOCKET_IO.md) for implementation.
