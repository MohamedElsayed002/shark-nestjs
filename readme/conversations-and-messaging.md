# Conversations & Messaging – Backend Documentation

This document describes the in-app messaging (chat) backend: what was built, how it works, and how to add WebSockets later.

---

## 1. Overview

The messaging system lets buyers and sellers talk **only inside the platform** (no sharing email/phone in chat). Each conversation is tied to a **listing** (`serviceId`) when started from a service page, so the platform can track which deal a chat belongs to (e.g. for commission).

- **Conversation**: one thread between two users (buyer + seller), optionally linked to one service.
- **Message**: a single message in a conversation (text only for now).

All endpoints require a valid JWT (`Authorization: Bearer <token>` or `access_token` cookie) and the user must be a participant to access a conversation or its messages.

---

## 2. Database

### 2.1 Collection: `conversations`

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated. |
| `participants` | [ObjectId] | Exactly 2 user IDs (ref: `Auth`). Stored in **sorted order** so the same pair always has the same array for lookups. |
| `serviceId` | ObjectId \| null | Optional ref to `Services`. Links the chat to a listing. |
| `lastMessageAt` | Date \| null | Set when a message is sent; used to sort the inbox. |
| `lastMessagePreview` | string | Truncated last message (max 200 chars in schema, 80 in code) for the conversation list. |
| `createdAt` / `updatedAt` | Date | From `timestamps: true`. |

**Index**

- Unique compound: `{ participants: 1, serviceId: 1 }`  
  Ensures at most one conversation per (user1, user2, service). Same two users can have one conversation per different listing.

**Schema file:** `src/schemas/conversation.schema.ts`

---

### 2.2 Collection: `messages`

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated. |
| `conversationId` | ObjectId | Ref: `Conversation`. |
| `senderId` | ObjectId | Ref: `Auth`. Who sent the message. |
| `content` | string | Plain text, max 4000 characters. |
| `readBy` | [ObjectId] | User IDs who have read this message (for future read receipts). Sender is added on create. |
| `createdAt` / `updatedAt` | Date | From `timestamps: true`. |

**Index**

- `{ conversationId: 1, createdAt: -1 }`  
  Used to list messages in a conversation with cursor-based pagination.

**Schema file:** `src/schemas/message.schema.ts`

---

## 3. API Endpoints

Base path: **`/conversations`**. All require **AuthGuard** and roles **Admin** or **User**.

| Method | Path | Description |
|--------|------|-------------|
| **POST** | `/conversations` | Create or get a conversation. Body: `{ sellerId, serviceId? }`. Caller = buyer; returns the conversation (created or existing). |
| **GET** | `/conversations` | List conversations for the current user. Sorted by `lastMessageAt` desc, then `createdAt` desc. |
| **GET** | `/conversations/:id` | Get one conversation by ID. Allowed only if the user is in `participants`. |
| **POST** | `/conversations/:id/messages` | Send a message. Body: `{ content }`. Allowed only if the user is a participant. |
| **GET** | `/conversations/:id/messages` | Get messages. Query: `cursor` (message ID), `limit` (default 50, max 100). Cursor-based pagination (newest first in DB, returned in chronological order). |

**Request/response examples**

- **POST /conversations**  
  Body: `{ "sellerId": "<mongoId>", "serviceId": "<mongoId>" }`  
  Response: conversation document with `participants` and `serviceId` populated (e.g. `name`, `email`, `category`).

- **GET /conversations/:id/messages**  
  Response: `{ messages: [...], nextCursor: "<id>" | null, hasMore: boolean }`.

---

## 4. Service Logic (`ConversationService`)

**File:** `src/conversation/conversation.service.ts`

### 4.1 `createOrGetConversation(buyerId, sellerId, serviceId?)`

- Rejects if `buyerId === sellerId`.
- Builds **normalized participants**: `[smallerId, biggerId]` so the same pair always has the same array.
- Finds a conversation with:
  - `participants` containing both IDs (order handled by normalization),
  - `serviceId` equal to the given id or `null` if not provided.
- If found: returns it (populated).
- If not: creates a new conversation with `participants`, `serviceId`, empty preview, then returns it (populated).

### 4.2 `getConversationsForUser(userId)`

- Finds all conversations where `participants` includes `userId`.
- Sorts by `lastMessageAt` desc, then `createdAt` desc.
- Returns list with `participants` and `serviceId` populated (for inbox UI).

### 4.3 `getConversationById(conversationId, userId)`

- Loads the conversation; if missing → 404.
- Checks that `userId` is in `participants`; if not → 403.
- Returns the conversation with `participants` and `serviceId` populated.

### 4.4 `sendMessage(conversationId, senderId, content)`

- Uses `assertParticipant(conversationId, senderId)` (same 404/403 as above).
- Trims `content`; rejects if empty.
- Creates a `Message` with `conversationId`, `senderId`, `content`, `readBy: [senderId]`.
- Updates the conversation: `lastMessageAt = now`, `lastMessagePreview = content` (truncated to 80 chars).
- Returns the new message with `senderId` populated (e.g. `name`).

### 4.5 `getMessages(conversationId, userId, cursor?, limit)`

- Uses `assertParticipant(conversationId, userId)`.
- Builds a query: `conversationId` + optional `createdAt < cursorDoc.createdAt` when `cursor` is a message ID.
- Fetches `limit + 1` messages, newest first, then reverses so the API returns chronological order.
- Returns `{ messages, nextCursor, hasMore }` for pagination.

---

## 5. Security

- **Authentication:** Every route uses `AuthGuard` (JWT from header or cookie). No anonymous access.
- **Authorization:** Only participants can read a conversation or its messages and send messages. Implemented via `assertParticipant` in the service.
- **Input:**  
  - `CreateConversationDto`: `sellerId` and optional `serviceId` validated as MongoIds.  
  - `SendMessageDto`: `content` length 1–4000, validated by class-validator.
- **Data exposed:** Populate uses `select: 'name email'` (and `category` for service) so the frontend does not get raw internal data beyond what’s needed for the UI.

---

## 6. Adding WebSockets Later

Right now the frontend can poll `GET /conversations/:id/messages` to get new messages. To push new messages in real time, add a WebSocket layer that **emits after a message is saved**.

### 6.1 Option A: NestJS native WebSockets (`@nestjs/websockets`)

1. **Install**

   ```bash
   npm i @nestjs/websockets @nestjs/platform-socket.io
   ```

2. **Create a gateway** (e.g. `src/conversation/conversation.gateway.ts`)

   - Use `@WebSocketGateway()` (optionally with `namespace: 'conversations'` and CORS).
   - On connection, the client sends auth (e.g. JWT in handshake query or first message). Validate the token, resolve the user ID, and store it (e.g. in a `Map<socketId, userId>`).
   - When a client “joins” a conversation, they emit e.g. `join_conversation` with `conversationId`. Server checks that the user is a participant (e.g. by calling `ConversationService.assertParticipant` or a small guard), then adds the socket to a room: `socket.join('conversation:' + conversationId)`.
   - When a client sends a message via REST (`POST .../messages`), after saving in `ConversationService.sendMessage`, inject the gateway and emit to the room:

     ```ts
     this.conversationGateway.server
       .to('conversation:' + conversationId)
       .emit('new_message', savedMessagePayload);
     ```

   So: **REST still creates the message**; the gateway only **broadcasts** it to clients in that conversation room.

3. **Register the gateway** in `ConversationModule` (in `providers` and/or `controllers` depending on your Nest setup).

4. **Frontend:** Use `socket.io-client`, connect to the same Nest server (e.g. `wss://api.example.com`), send JWT on connect, emit `join_conversation` with the current `conversationId`, and listen for `new_message` to append to the local message list (or refetch).

### 6.2 Option B: Socket.io adapter (same idea, explicit adapter)

- In `main.ts`, use `IoAdapter` from `@nestjs/platform-socket.io` so Nest uses Socket.io.
- Same gateway idea: rooms per `conversationId`, emit `new_message` from the service after `sendMessage`.

### 6.3 Minimal flow (no gateway yet)

- **Now:** Frontend polls `GET /conversations/:id/messages` every few seconds when the chat screen is open.
- **Later:** Add the gateway; after `sendMessage` in `ConversationService`, call a method that emits to the conversation room. Frontend subscribes to the room and listens for `new_message`; optionally stop or reduce polling when WebSocket is connected.

### 6.4 What to emit

Emit the same shape the REST “send message” returns (e.g. message with `senderId` populated with `name`). That way the frontend can append one object to the list without refetching.

### 6.5 Auth on WebSocket

- Validate JWT in the gateway (e.g. on `connection` or on `join_conversation`). Use the same `JwtService` and secret as the REST API.
- If the token is invalid or the user is not a participant for the given `conversationId`, disconnect or reply with an error and do not add the socket to the room.

---

## 7. File Reference

| Purpose | Path |
|--------|------|
| Conversation schema | `src/schemas/conversation.schema.ts` |
| Message schema | `src/schemas/message.schema.ts` |
| Create-conversation DTO | `src/conversation/dto/create-conversation.dto.ts` |
| Send-message DTO | `src/conversation/dto/send-message.dto.ts` |
| Service | `src/conversation/conversation.service.ts` |
| Controller | `src/conversation/conversation.controller.ts` |
| Module | `src/conversation/conversation.module.ts` |

`ConversationModule` is imported in `src/app.module.ts`.
