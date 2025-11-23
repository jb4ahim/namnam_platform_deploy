# Customer API - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Missing Features Analysis](#missing-features-analysis)
6. [Feature Recommendations](#feature-recommendations)
7. [Setup & Configuration](#setup--configuration)

---

## Overview

The Customer API is a NestJS-based backend service for a food delivery/marketplace platform. It provides comprehensive endpoints for customer-facing operations including authentication, product browsing, cart management, order processing, and more.

**Technology Stack:**
- Framework: NestJS with Fastify adapter
- Database: PostgreSQL with stored procedures
- Authentication: JWT-based token system
- Validation: class-validator with global pipes
- Port: 3002 (configurable)
- API Prefix: `/api`
- Postman: `docs/postman/customer-api.postman_collection.json` (importable; contains sample payloads and variables)

> Reality checks: OTP verification currently uses a hardcoded code (`123456`); several optional query params are treated as required due to Nest pipes; some repository filters are ignored (see module notes below).

---

## Architecture

### Module Structure

The API follows a modular architecture with the following modules:

| Module | Routes | Auth Required | Purpose |
|--------|--------|---------------|---------|
| Auth | `/api/auth` | Mixed | User authentication via OTP |
| Users | `/api/users` | Yes | User profile management |
| Address | `/api/address` | Mixed | Delivery address management |
| Products | `/api/products` | Yes | Product catalog browsing |
| Merchants | `/api/merchants` | Yes | Merchant discovery |
| Categories | `/api/categories` | Yes | Category hierarchy |
| Promotions | `/api/promotions` | Mixed | Promotional offers |
| Cart | `/api/cart` | Yes | Shopping cart operations |
| Orders | `/api/orders` | Yes | Order management |
| App-Config | `/api/app-config` | No | App configuration |

### Design Patterns

- **Repository Pattern**: Data access layer abstracted through repositories
- **Service Pattern**: Business logic encapsulated in services
- **DTO Pattern**: Data validation via Data Transfer Objects
- **Dependency Injection**: NestJS built-in DI container
- **Stored Procedures**: All database operations via PostgreSQL functions

---

## Authentication

### Flow

1. **Send OTP**: Customer requests OTP via phone number
2. **Verify OTP**: Customer submits OTP code (currently hardcoded as '123456' for testing)
3. **Register/Login**: System generates JWT access and refresh tokens
4. **Protected Routes**: Include JWT token in `Authorization: Bearer <token>` header

> Reality check: `send-otp` currently returns `200` with an empty body; `verify-otp` returns either token pair for existing users or `{ isRegistered: false, verifyToken, expiresAt }` for new users; `register` requires `verifyToken` from the previous step and returns a token pair (no user object).

### Token Management

- **Access Token**: Short-lived token for API requests
- **Refresh Token**: Long-lived token to obtain new access tokens
- **Refresh Endpoint**: `POST /api/auth/refresh-token`

### User Context

Protected endpoints use `@CurrentUserId()` decorator to extract user ID from JWT claims, ensuring data isolation per user.

---

## API Endpoints

### Authentication Module (`/api/auth`)

#### Send OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "countryCode": "+1",      // Pattern: ^\+\d{1,4}$
  "phoneNumber": "1234567890" // Pattern: ^\d{6,15}$
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "countryCode": "+1",
  "phoneNumber": "1234567890",
  "code": "123456"           // Currently hardcoded for testing
}
```

**Response:**
```json
// existing user
{ "isRegistered": true, "accessToken": "...", "refreshToken": "..." }

// new user
{ "isRegistered": false, "verifyToken": "...", "expiresAt": "ISO string" }
```

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "gender": "male",
  "birthday": "1990-01-01",
  "defaultCurrency": "USD",
  "verifyToken": "<from verify-otp>"  // Required
}
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "token": "eyJhbGc..." // property name is "token" in controller/service
}
```

---

### Users Module (`/api/users`)

#### Get User Profile
```http
GET /api/users
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 123,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "1234567890",
  "countryCode": "+1",
  "gender": "male",
  "birthday": "1990-01-01",
  "defaultCurrency": "USD"
}
```

---

### Profile Module (`/api/users`)

All profile endpoints require authentication.

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "profile_image_url": "https://example.com/avatar.jpg"
}
```

#### Change Password
```http
PUT /api/users/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "current_password": "old",
  "new_password": "new"
}
```

#### Get Preferences
```http
GET /api/users/preferences
Authorization: Bearer <token>
```

#### Update Preferences
```http
PUT /api/users/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "language": "en",
  "currency": "USD",
  "notifications_enabled": true,
  "email_notifications": true,
  "push_notifications": true,
  "sms_notifications": false,
  "marketing_emails": false,
  "theme": "auto",
  "timezone": "UTC"
}
```

#### Delete Account
```http
DELETE /api/users/account
Authorization: Bearer <token>
```

---

### Address Module (`/api/address`)

#### List Addresses
```http
GET /api/address
Authorization: Bearer <token>
```

#### Get Address by ID
```http
GET /api/address/:id
Authorization: Bearer <token>
```

#### Create Address
```http
POST /api/address
Authorization: Bearer <token>
Content-Type: application/json

{
  "label": "Home",
  "addressLine1": "123 Main St",
  "city": "New York",
  "state": "NY",
  "addressLine2": "Apt 4B",
  "country": "USA",
  "apartment": "4B",
  "building": "Building A",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "isDefault": true
}
```

#### Update Address
```http
PUT /api/address/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "label": "Work",
  "addressLine1": "456 Office Blvd"
  // ... other fields optional
}
```

#### Set Default Address
```http
PATCH /api/address/:id/set-default
Authorization: Bearer <token>
```

#### Get Allowed Zones
```http
GET /api/address/allowed-zones
```

---

### Products Module (`/api/products`)

#### List Products
```http
GET /api/products?merchantId=1&categoryId=5&minPrice=10&maxPrice=50&isAvailable=true&hasDiscount=true&limit=20
Authorization: Bearer <token>
```

**Query Parameters:**
- `merchantId` (required): Filter by merchant
- `categoryId`: Filter by category
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `isAvailable`: Only available products
- `hasDiscount`: Only products with discounts
- `limit`: Results limit

> Reality check: repository defaults `isAvailable` to `true` and ignores explicit `false`; `hasDiscount=false` is treated as `null`; zero `limit` is dropped.

#### Get Product Details
```http
GET /api/products/:id
Authorization: Bearer <token>
```

---

### Merchants Module (`/api/merchants`)

#### List Merchants
```http
GET /api/merchants?latitude=40.7128&longitude=-74.0060&categoryId=1&zoneId=1&minRating=4&isOpen=true&hasDiscount=true&limit=50
Authorization: Bearer <token>
```

**Query Parameters:**
- `latitude`: User's latitude for distance calculation
- `longitude`: User's longitude for distance calculation
- `categoryId`: Filter by category
- `zoneId`: Filter by delivery zone
- `minRating`: Minimum rating filter
- `isOpen`: Only open merchants
- `hasDiscount`: Only merchants with active discounts
- `limit`: Results limit (default: 50)

> Reality check: repository currently ignores `minRating`, `isOpen`, and `hasDiscount`, and only forwards latitude/longitude/category/zone/limit.

#### Get Merchant Details
```http
GET /api/merchants/:id
Authorization: Bearer <token>
```

---

### Categories Module (`/api/categories`)

#### List Categories
```http
GET /api/categories?parentId=1
Authorization: Bearer <token>
```

**Query Parameters:**
- `parentId`: Filter by parent category (optional)

#### Get Category Details
```http
GET /api/categories/:id
Authorization: Bearer <token>
```

---

### Promotions Module (`/api/promotions`)

#### List Promotions
```http
GET /api/promotions?categoryId=1&isFeatured=true&limit=10
```

**Query Parameters:**
- `categoryId`: Filter by category
- `isFeatured`: Only featured promotions
- `limit`: Results limit

> Reality check: repository ignores `isFeatured` and forwards only `categoryId` and `limit`.

#### Get Promotion Details
```http
GET /api/promotions/:id
Authorization: Bearer <token>
```

---

### Cart Module (`/api/cart`)

All cart endpoints require authentication.

#### Get Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

**Response:**
```json
{
  "items": [
    {
      "cart_item_id": 1,
      "product_id": 101,
      "product_name": "Pizza",
      "quantity": 2,
      "price": 15.99,
      "subtotal": 31.98
    }
  ],
  "total": 31.98
}
```

#### Get Cart Summary
```http
GET /api/cart/summary
Authorization: Bearer <token>
```

#### Get Cart Item
```http
GET /api/cart/items/:itemId
Authorization: Bearer <token>
```

#### Add Item to Cart
```http
POST /api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": 101,
  "quantity": 2           // Min: 1
}
```

#### Update Cart Item
```http
PUT /api/cart/items/:itemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3           // Min: 1
}
```

#### Bulk Update Cart Items
```http
PUT /api/cart/items/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    { "cart_item_id": 1, "quantity": 2 },
    { "cart_item_id": 2, "quantity": 1 }
  ]
}
```

#### Remove Cart Item
```http
DELETE /api/cart/items/:itemId
Authorization: Bearer <token>
```

#### Clear Cart
```http
DELETE /api/cart
Authorization: Bearer <token>
```

#### Merge Guest Cart
```http
POST /api/cart/merge
Authorization: Bearer <token>
Content-Type: application/json

{
  "guestCartItems": [
    { "product_id": 101, "quantity": 2 }
  ]
}
```

#### Apply Coupon
```http
POST /api/cart/apply-coupon
Authorization: Bearer <token>
Content-Type: application/json

{
  "coupon_code": "SAVE20"
}
```

---

### Orders Module (`/api/orders`)

All order endpoints require authentication.

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "delivery_address_id": 1,
  "cartId": 123,
  "payment_method": "credit_card",
  "scheduled_for": "2025-11-24T14:00:00Z",  // Optional
  "delivery_instructions": "Ring doorbell"   // Optional
}
```

#### List Orders
```http
GET /api/orders?status=pending&startDate=2025-11-01&endDate=2025-11-30
Authorization: Bearer <token>
```

**Query Parameters:**
- `status`: Filter by order status
- `startDate`: Start date filter
- `endDate`: End date filter

#### Get Order Details
```http
GET /api/orders/:orderId
Authorization: Bearer <token>
```

#### Get Payment Status
```http
GET /api/orders/:orderId/payment
Authorization: Bearer <token>
```

#### Get Order Tracking
```http
GET /api/orders/:orderId/tracking
Authorization: Bearer <token>
```

#### Cancel Order
```http
PUT /api/orders/:orderId/cancel
Authorization: Bearer <token>
```

#### Update Delivery Instructions
```http
PUT /api/orders/:orderId/delivery
Authorization: Bearer <token>
Content-Type: application/json

{
  "delivery_instructions": "Leave at door"
}
```

#### Request Refund
```http
POST /api/orders/:orderId/refund
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Item damaged",
  "notes": "Package was damaged on delivery"  // Optional
}
```

---

### App Config Module (`/api/app-config`)

#### Get Home Configuration
```http
GET /api/app-config/home?zoneId=1
```

**Query Parameters:**
- `zoneId`: Zone-specific configuration (optional)

---

## Missing Features Analysis

### Critical Missing Features

> Include also: optional query params use `ParseIntPipe`/`ParseFloatPipe` even when omitted, causing 400s if absent. Consider custom pipes that allow `undefined`.

#### 1. **Favorites/Wishlist System**
- **What's Missing**: No endpoints to save favorite products or merchants
- **Impact**: Customers cannot bookmark items for later purchase
- **Priority**: HIGH
- **Suggested Endpoints**:
  - `POST /api/favorites/products/:productId` - Add product to favorites
  - `DELETE /api/favorites/products/:productId` - Remove from favorites
  - `GET /api/favorites/products` - List favorite products
  - `POST /api/favorites/merchants/:merchantId` - Add merchant to favorites
  - `GET /api/favorites/merchants` - List favorite merchants

#### 2. **Reviews & Ratings**
- **What's Missing**: No customer review/rating system
- **Impact**: No social proof, no feedback mechanism
- **Priority**: HIGH
- **Suggested Endpoints**:
  - `POST /api/reviews/products/:productId` - Review a product
  - `POST /api/reviews/merchants/:merchantId` - Review a merchant
  - `GET /api/reviews/products/:productId` - Get product reviews
  - `GET /api/reviews/merchants/:merchantId` - Get merchant reviews
  - `PUT /api/reviews/:reviewId` - Update review
  - `DELETE /api/reviews/:reviewId` - Delete review

#### 3. **Search Functionality**
- **What's Missing**: No unified search endpoint
- **Impact**: Poor user experience for finding products/merchants
- **Priority**: HIGH
- **Suggested Endpoints**:
  - `GET /api/search?q=pizza&type=products` - Unified search
  - `GET /api/search/products?q=pizza` - Product search
  - `GET /api/search/merchants?q=restaurant` - Merchant search
  - `GET /api/search/suggestions?q=piz` - Autocomplete suggestions

#### 4. **Notifications System**
- **What's Missing**: No notification endpoints
- **Impact**: Customers miss important order updates
- **Priority**: MEDIUM
- **Suggested Endpoints**:
  - `GET /api/notifications` - List user notifications
  - `PUT /api/notifications/:id/read` - Mark as read
  - `PUT /api/notifications/read-all` - Mark all as read
  - `GET /api/notifications/preferences` - Get notification preferences
  - `PUT /api/notifications/preferences` - Update preferences

#### 5. **Payment Integration**
- **What's Missing**: No payment processing endpoints
- **Impact**: Orders cannot be completed
- **Priority**: CRITICAL
- **Suggested Endpoints**:
  - `POST /api/payments/intent` - Create payment intent
  - `POST /api/payments/:orderId/confirm` - Confirm payment
  - `GET /api/payments/methods` - List saved payment methods
  - `POST /api/payments/methods` - Add payment method
  - `DELETE /api/payments/methods/:id` - Remove payment method

#### 6. **Customer Support**
- **What's Missing**: No support/help ticket system
- **Impact**: No direct communication channel for issues
- **Priority**: MEDIUM
- **Suggested Endpoints**:
  - `POST /api/support/tickets` - Create support ticket
  - `GET /api/support/tickets` - List user tickets
  - `GET /api/support/tickets/:id` - Get ticket details
  - `POST /api/support/tickets/:id/messages` - Add message to ticket
  - `PUT /api/support/tickets/:id/close` - Close ticket

#### 7. **Loyalty & Rewards**
- **What's Missing**: No loyalty points or rewards system
- **Impact**: No incentive for repeat purchases
- **Priority**: LOW
- **Suggested Endpoints**:
  - `GET /api/loyalty/points` - Get user points balance
  - `GET /api/loyalty/history` - Points transaction history
  - `GET /api/loyalty/rewards` - Available rewards
  - `POST /api/loyalty/redeem/:rewardId` - Redeem reward

#### 8. **User Profile Enhancement**
- **What's Missing**: Limited profile management
- **Impact**: Cannot update profile, manage preferences
- **Priority**: MEDIUM
- **Suggested Endpoints**:
  - `PUT /api/users/profile` - Update user profile
  - `PUT /api/users/password` - Change password (if password auth added)
  - `GET /api/users/preferences` - Get user preferences
  - `PUT /api/users/preferences` - Update preferences
  - `DELETE /api/users/account` - Delete account

#### 9. **Order History Enhancements**
- **What's Missing**: Limited order history features
- **Impact**: Poor order management experience
- **Priority**: MEDIUM
- **Suggested Endpoints**:
  - `POST /api/orders/:orderId/reorder` - Reorder previous order
  - `GET /api/orders/:orderId/invoice` - Download invoice
  - `POST /api/orders/:orderId/rate` - Rate delivery experience
  - `GET /api/orders/statistics` - User order statistics

#### 10. **Social Features**
- **What's Missing**: No sharing or referral system
- **Impact**: Limited organic growth
- **Priority**: LOW
- **Suggested Endpoints**:
  - `POST /api/referrals/code` - Generate referral code
  - `GET /api/referrals/stats` - Referral statistics
  - `POST /api/share/product/:productId` - Share product
  - `POST /api/share/merchant/:merchantId` - Share merchant

---

## Feature Recommendations

### Enhanced Customer Experience

#### 1. **Real-Time Order Tracking**
Implement WebSocket or Server-Sent Events for live order updates.

**Implementation:**
- Add WebSocket gateway: `@nestjs/platform-socket.io`
- Track driver location in real-time
- Push notifications for order status changes
- Estimated delivery time updates

#### 2. **Dietary Preferences & Filters**
Help customers find suitable food options.

**Features:**
- Vegetarian/Vegan filters
- Allergen information
- Dietary restrictions (Gluten-free, Dairy-free, etc.)
- Nutritional information display
- Calorie counter

#### 3. **Smart Recommendations**
AI-powered personalized suggestions.

**Features:**
- "Customers also bought" suggestions
- Personalized homepage
- Based on order history
- Trending items in user's area
- Time-based recommendations (breakfast, lunch, dinner)

#### 4. **Group Orders & Sharing**
Allow multiple people to contribute to one order.

**Features:**
- Create shareable cart link
- Multiple users can add items
- Split payment options
- Group order coordinator
- Real-time cart updates

#### 5. **Scheduled & Recurring Orders**
Plan ahead for regular deliveries.

**Features:**
- Schedule orders for future dates
- Recurring weekly/monthly orders
- Subscription meal plans
- Modify scheduled orders
- Pause/resume subscriptions

#### 6. **Wallet & Credits**
Internal payment system for better UX.

**Features:**
- Add money to wallet
- Refund to wallet
- Wallet payment option
- Credit balance display
- Transaction history
- Gift cards

#### 7. **Live Chat Support**
Real-time customer assistance.

**Features:**
- Chat with customer support
- Chat with merchant (order questions)
- Chat with delivery driver
- Automated chatbot for common questions
- File attachment support

#### 8. **Voice Ordering**
Voice-activated ordering experience.

**Features:**
- Voice search
- Voice-to-text order placement
- Voice navigation
- Accessibility enhancement

#### 9. **AR Menu Preview**
Augmented reality food visualization.

**Features:**
- 3D food models
- AR portion size preview
- Virtual table placement
- Enhanced product images

#### 10. **Gamification**
Make ordering more engaging.

**Features:**
- Achievement badges
- Order streaks
- Leaderboards
- Spin-to-win promotions
- Daily challenges
- Surprise rewards

#### 11. **Multi-Language Support**
Internationalization for broader reach.

**Features:**
- Language selection endpoint
- Localized content
- Currency conversion
- Regional pricing

#### 12. **Accessibility Features**
Ensure platform is usable by everyone.

**Features:**
- Screen reader optimization
- High contrast mode
- Font size adjustments
- Keyboard navigation
- Alternative text for images

---

## Setup & Configuration

### Environment Variables

```env
# Server
PORT=3002
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=namnam
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# OTP (for production)
OTP_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
```

### Installation

```bash
# Install dependencies
npm install

# Start customer API (dev)
npm run start:dev:customer

# Start customer API (prod build then run)
npm run build:customer && npm run start:customer

# Run targeted tests (see note below)
npm run test

# Build for production
npm run build

# Start production server
npm run start:prod
```

### Testing

Current state:
- Unit tests are minimal; new specs exist for `auth.controller`, `promotions.service`, and `app-config.service`.
- E2E spec (`apps/customer_api/test/app.e2e-spec.ts`) is skipped until integration deps are available.
- Jest has two configs (`jest.config.js` and `jest` in `package.json`); choose one or remove the other to run tests cleanly.

```bash
# Example: run specific specs with the root Jest config
npx jest --config jest.config.js --runTestsByPath apps/customer_api/src/modules/auth/auth.controller.spec.ts
```

### API Client Examples

#### JavaScript/TypeScript
```typescript
const baseURL = 'http://localhost:3002/api';

// Send OTP
const sendOTP = async (countryCode: string, phoneNumber: string) => {
  const response = await fetch(`${baseURL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ countryCode, phoneNumber })
  });
  return response.json();
};

// Get Cart
const getCart = async (token: string) => {
  const response = await fetch(`${baseURL}/cart`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

#### cURL
```bash
# Send OTP
curl -X POST http://localhost:3002/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"countryCode":"+1","phoneNumber":"1234567890"}'

# Get Cart
curl http://localhost:3002/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Best Practices

### Error Handling
- All errors follow standardized format via GlobalExceptionFilter
- HTTP status codes properly implemented
- Descriptive error messages
- Validation errors include field-specific details

### Security
- JWT token expiration enforced
- Input validation on all endpoints
- SQL injection prevention via parameterized queries
- XSS prevention via input sanitization
- CORS properly configured

### Performance
- Database queries optimized via stored procedures
- Fastify for high-performance HTTP handling
- Response caching where appropriate
- Pagination on list endpoints

### Versioning
Consider implementing API versioning for future updates:
```typescript
// Example: /api/v1/products, /api/v2/products
app.setGlobalPrefix('api/v1');
```

---

## Next Steps

### Immediate Priorities
1. Implement payment integration (CRITICAL)
2. Add search functionality (HIGH)
3. Build reviews & ratings system (HIGH)
4. Create favorites/wishlist (HIGH)
5. Set up notification system (MEDIUM)

### Medium-Term Goals
1. Real-time order tracking
2. Customer support ticketing
3. Enhanced user profile management
4. Loyalty & rewards program
5. Live chat integration

### Long-Term Vision
1. AI-powered recommendations
2. Voice ordering
3. AR menu preview
4. Gamification features
5. Advanced analytics

---

## Support & Contribution

For issues, questions, or contributions, please contact the development team.

**API Version:** 1.0.0
**Last Updated:** November 2025
**Maintained By:** NamNam Platform Team
