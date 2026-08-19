# Management API - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Authentication](#authentication)
4. [API Endpoints Reference](#api-endpoints-reference)
5. [Missing Features Analysis](#missing-features-analysis)
6. [Proposed New Features](#proposed-new-features)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Best Practices](#best-practices)

---

## Overview

The Management API is a comprehensive NestJS-based platform administration service that enables platform operators to manage all aspects of the NamNam food delivery ecosystem. It provides complete control over merchants, users, content, zones, promotions, and app configuration.

### Key Specifications
- **Framework**: NestJS with Fastify adapter
- **Database**: PostgreSQL with stored procedures
- **Authentication**: JWT-based (email + password)
- **Port**: 3003
- **API Prefix**: `/api`
- **Total Endpoints**: 35+
- **Storage**: AWS S3 for images (presigned URLs)

### Core Capabilities
- Management user authentication
- Customer and merchant user management
- Merchant approval and governance workflow
- Product category management with hierarchy
- Geographic zone and polygon management
- Platform-wide promotions
- Flexible coupon system with rules
- Dynamic home page configuration
- Merchant catalog visibility
- Contact and location management

---

## Architecture

### Technology Stack
```
┌─────────────────────────────────────┐
│    NestJS Management Application    │
├─────────────────────────────────────┤
│  Fastify HTTP Server (Port 3003)    │
├─────────────────────────────────────┤
│      Global Middleware Layer        │
│  - ValidationPipe                   │
│  - ResponseEnvelopeInterceptor      │
│  - GlobalExceptionFilter            │
│  - CORS                             │
│  - Multipart Upload (2MB max)       │
└─────────────────────────────────────┘
          ↓
┌─────────────────────────────────────┐
│         Module Structure             │
├─────────────────────────────────────┤
│  ┌──────────────────────────────┐  │
│  │  Controllers (HTTP Layer)    │  │
│  └────────────┬─────────────────┘  │
│               ↓                     │
│  ┌──────────────────────────────┐  │
│  │  Services (Business Logic)   │  │
│  └────────────┬─────────────────┘  │
│               ↓                     │
│  ┌──────────────────────────────┐  │
│  │  Repositories (Data Access)  │  │
│  └────────────┬─────────────────┘  │
└───────────────┼─────────────────────┘
                ↓
┌─────────────────────────────────────┐
│   PostgreSQL Database Layer         │
│   (Stored Procedures/Functions)     │
└─────────────────────────────────────┘
        ↓               ↑
┌───────────────────────────────────┐
│     AWS S3 Storage                │
│  (Category/Promotion Images)      │
└───────────────────────────────────┘
```

### Module Organization

| Module | Purpose | Auth Required | Key Features |
|--------|---------|---------------|--------------|
| Auth | Management user authentication | Partial | Login, Register, JWT tokens |
| Users | Platform user management | No* | View customers & merchants |
| Merchants | Merchant governance | Yes | Approve, suspend, catalog management |
| Categories | Product categories | No* | Hierarchy, images, CRUD |
| Zones | Geographic zones | No* | Polygon boundaries, delivery areas |
| Promotions | Platform promotions | Yes | Bilingual, action types, scheduling |
| Coupons | Discount coupons | No* | Rules, validation, usage tracking |
| App-Config | Dynamic content | Mixed | Home page sections, TTL caching |

*Some endpoints are public while others require authentication

---

## Authentication

### Flow Overview
```
1. Management user enters email and password
   ↓
2. POST /api/auth/login
   ↓
3. Returns: accessToken, refreshToken
   ↓
4. Use access token for authenticated requests
   ↓
5. Refresh token when needed via POST /api/auth/refresh-token
```

### Registration Flow
```
1. POST /api/auth/register
   ↓
2. Provide: name, email, password, phoneNumber
   ↓
3. Password hashed with bcrypt (10 rounds)
   ↓
4. Management user created in database
   ↓
5. Returns: success message
   ↓
6. Login with credentials to get tokens
```

### Security Features
- **Password Protection**: Bcrypt hashing (salt rounds: 10)
- **JWT Tokens**: Dual-token system (access + refresh)
- **Token Payload**: Contains managementUserId and userId
- **No explicit roles**: All authenticated management users have full access

### Protected Endpoints
Protected endpoints require the `Authorization` header:
```
Authorization: Bearer <access_token>
```

---

## API Endpoints Reference

### Auth Module (`/api/auth`)

#### 1. Register Management User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@namnam.com",
  "password": "SecurePass123!",
  "phoneNumber": "+11234567890",
  "defaultCurrency": "USD",          // Optional
  "countryCode": "+1"                // Optional
}
```

**Response**:
```json
{
  "message": "Management user registered successfully"
}
```

**Validation**:
- name: Required string
- email: Required, valid email format
- password: Required, minimum 8 characters
- phoneNumber: Required, valid phone format

---

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@namnam.com",
  "password": "SecurePass123!"
}
```

**Response**:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "managementUserId": 1,
    "userId": 123,
    "name": "Admin User",
    "email": "admin@namnam.com"
  }
}
```

---

#### 3. Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

**Response**:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

---

### Users Module (`/api/users`)

#### 1. Get Customers
```http
GET /api/users/customers?page=1&pageSize=20&sortBy=created_at&sortOrder=DESC&search=john
```

**Query Parameters**:
- `page` (number, default: 1): Page number
- `pageSize` (number, default: 20): Items per page
- `sortBy` (string, default: 'created_at'): Field to sort by
- `sortOrder` (string, default: 'DESC'): ASC or DESC
- `search` (string, optional): Search term

**Response**:
```json
{
  "items": [
    {
      "id": 123,
      "first_name": "John",
      "last_name": "Doe",
      "phone_number": "+11234567890",
      "email": "john@example.com",
      "status": "active",
      "created_at": "2025-01-15T10:00:00Z"
    }
  ],
  "totalCount": 150,
  "page": 1,
  "pageSize": 20,
  "totalPages": 8
}
```

---

#### 2. Get Merchants
```http
GET /api/users/merchants?page=1&pageSize=20&sortBy=created_at&sortOrder=DESC&search=pizza
```

**Query Parameters**: Same as customers

**Response**:
```json
{
  "items": [
    {
      "id": 456,
      "name": "Pizza Palace",
      "email": "contact@pizzapalace.com",
      "phone_number": "+10987654321",
      "status": "active",
      "created_at": "2025-01-10T08:00:00Z"
    }
  ],
  "totalCount": 75,
  "page": 1,
  "pageSize": 20,
  "totalPages": 4
}
```

---

### Merchants Module (`/api/merchants`)

All merchant management endpoints require authentication.

#### 1. List Merchants
```http
GET /api/merchants?page=1&pageSize=20&sortBy=created_at&sortOrder=DESC&search=restaurant
Authorization: Bearer <token>
```

**Query Parameters**: Same as users module

**Response**:
```json
{
  "items": [
    {
      "id": 456,
      "name": "Pizza Palace",
      "logo": "https://s3-presigned-url...",
      "status": "ACTIVE",
      "verification_status": "VERIFIED",
      "created_at": "2025-01-10T08:00:00Z"
    }
  ],
  "totalCount": 75,
  "page": 1,
  "pageSize": 20,
  "totalPages": 4
}
```

**Merchant Status Values**:
- `PENDING` - Awaiting approval
- `ACTIVE` - Approved and operating
- `SUSPENDED` - Temporarily suspended
- `REJECTED` - Application rejected

---

#### 2. Get Merchant Information
```http
GET /api/merchants/:id/info
Authorization: Bearer <token>
```

**Path Parameters**:
- `id` (number): Merchant ID

**Response**:
```json
{
  "id": 456,
  "name": "Pizza Palace",
  "description": "Authentic Italian pizza",
  "coverUrl": "https://s3-presigned-url...",
  "logoUrl": "https://s3-presigned-url...",
  "categoryId": 10,
  "categoryName": "Italian",
  "hotline": "+11234567890",
  "status": "ACTIVE",
  "verificationStatus": "VERIFIED",
  "createdAt": "2025-01-10T08:00:00Z"
}
```

---

#### 3. Get Merchant Schedule
```http
GET /api/merchants/:id/schedules
Authorization: Bearer <token>
```

**Response**:
```json
{
  "weeklySchedule": [
    {
      "day": "Monday",
      "isOpen": true,
      "openTime": "09:00",
      "closeTime": "22:00"
    },
    {
      "day": "Sunday",
      "isOpen": false
    }
  ]
}
```

---

#### 4. Get Contact Persons
```http
GET /api/merchants/:id/contact-persons
Authorization: Bearer <token>
```

**Response**:
```json
[
  {
    "id": 1,
    "name": "John Manager",
    "phone": "+11234567890",
    "email": "john@pizzapalace.com",
    "position": "Manager",
    "isPrimary": true
  }
]
```

---

#### 5. Get Merchant Location
```http
GET /api/merchants/:id/location
Authorization: Bearer <token>
```

**Response**:
```json
{
  "id": 789,
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "buildingNumber": "123",
  "floor": "Ground",
  "landmarks": "Near Central Park"
}
```

---

#### 6. Get Merchant Catalog
```http
GET /api/merchants/:id/catalog
Authorization: Bearer <token>
```

**Response**:
```json
{
  "sections": [
    {
      "id": 1,
      "name": "Breakfast",
      "nameAr": "فطور",
      "displayOrder": 1,
      "productCount": 12
    }
  ]
}
```

---

#### 7. Get Catalog Section Products
```http
GET /api/merchants/:id/catalog/sections/:sectionId/products
Authorization: Bearer <token>
```

**Path Parameters**:
- `id` (number): Merchant ID
- `sectionId` (number): Section ID

**Response**:
```json
{
  "products": [
    {
      "id": 101,
      "name": "Margherita Pizza",
      "nameAr": "بيتزا مارغريتا",
      "price": 12.99,
      "images": ["https://s3-url..."],
      "isEnabled": true
    }
  ]
}
```

---

#### 8. Get Merchant Requests
```http
GET /api/merchants/merchant-requests?page=1&pageSize=20
Authorization: Bearer <token>
```

**Purpose**: Get pending merchant approval requests.

**Response**:
```json
{
  "items": [
    {
      "id": 10,
      "merchantId": 456,
      "merchantName": "New Restaurant",
      "status": "PENDING",
      "requestedAt": "2025-11-23T10:00:00Z",
      "notes": "All information completed"
    }
  ],
  "totalCount": 5,
  "page": 1,
  "pageSize": 20
}
```

---

#### 9. Approve Merchant
```http
POST /api/merchants/:id/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Approved after verification"  // Optional
}
```

**Response**:
```json
{
  "message": "Merchant approved successfully",
  "merchantId": 456,
  "status": "ACTIVE"
}
```

**Business Logic**:
- Changes merchant status to ACTIVE
- Sends approval notification to merchant
- Merchant can now accept orders

---

#### 10. Suspend Merchant
```http
POST /api/merchants/:id/suspend
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "quality_issues",           // Optional
  "notes": "Multiple customer complaints" // Optional
}
```

**Response**:
```json
{
  "message": "Merchant suspended successfully",
  "merchantId": 456,
  "status": "SUSPENDED"
}
```

**Business Logic**:
- Changes merchant status to SUSPENDED
- Merchant cannot accept new orders
- Sends suspension notification
- Existing orders can be completed

---

#### 11. Delete Merchant
```http
DELETE /api/merchants/:id
Authorization: Bearer <token>
```

**Response**:
```json
{
  "message": "Merchant deleted successfully"
}
```

**Warning**: This is a destructive operation. Consider soft delete in production.

---

#### 12. Update Merchant Status
```http
PATCH /api/merchants/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "ACTIVE",        // Required: PENDING, ACTIVE, SUSPENDED, REJECTED
  "zoneId": 5                // Optional: Assign delivery zone
}
```

**Response**:
```json
{
  "message": "Merchant status updated successfully",
  "status": "ACTIVE",
  "zoneId": 5
}
```

---

### Categories Module (`/api/categories`)

#### 1. List Categories
```http
GET /api/categories?parentId=1
```

**Query Parameters**:
- `parentId` (number, optional): Filter by parent category for hierarchy

**Response**:
```json
[
  {
    "id": 1,
    "name": "Food",
    "parentId": null,
    "status": "active",
    "imageUrl": "https://s3-presigned-url...",
    "createdAt": "2025-01-01T00:00:00Z"
  },
  {
    "id": 10,
    "name": "Italian",
    "parentId": 1,
    "status": "active",
    "imageUrl": "https://s3-presigned-url...",
    "createdAt": "2025-01-02T00:00:00Z"
  }
]
```

---

#### 2. Create Category
```http
POST /api/categories
Content-Type: application/json

{
  "name": "Japanese",
  "parentId": 1,              // Optional: for subcategories
  "status": "active",         // Optional: default 'active'
  "imageKey": "categories/japanese.jpg"  // Optional: S3 key
}
```

**Response**:
```json
{
  "message": "Category created successfully",
  "categoryId": 15
}
```

---

#### 3. Update Category
```http
PATCH /api/categories/updateCategories
Content-Type: application/json

{
  "id": 15,
  "name": "Japanese Cuisine",
  "status": "active",
  "imageKey": "categories/japanese-updated.jpg"
}
```

**Response**:
```json
{
  "message": "Category updated successfully"
}
```

---

#### 4. Delete Category
```http
DELETE /api/categories/:id
Authorization: Bearer <token>
```

**Path Parameters**:
- `id` (number, required): Category ID to delete

**Behavior**:
- Returns 404 if the category does not exist
- Child categories are unlinked (their `parentId` is set to `null`)
- Product-category links for this category are removed
- Merchant and promotion `categoryId` references are cleared

**Response**:
```json
{
  "success": true
}
```

---

### Zones Module (`/api/zones`)

#### 1. List Zones
```http
GET /api/zones
```

**Response**:
```json
[
  {
    "id": 1,
    "zoneName": "Downtown",
    "zoneDescription": "Downtown delivery area",
    "createdAt": "2025-01-01T00:00:00Z"
  }
]
```

---

#### 2. Get Zone by ID
```http
GET /api/zones/:id
```

**Response**:
```json
{
  "id": 1,
  "zoneName": "Downtown",
  "zoneDescription": "Downtown delivery area",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

---

#### 3. Create Zone
```http
POST /api/zones
Content-Type: application/json

{
  "zoneName": "Uptown",
  "zoneDescription": "Uptown residential area"  // Optional
}
```

**Response**:
```json
{
  "message": "Zone created successfully",
  "zoneId": 2
}
```

---

#### 4. Update Zone
```http
PATCH /api/zones/:id
Content-Type: application/json

{
  "zoneName": "Uptown District",
  "zoneDescription": "Uptown residential and commercial area"
}
```

**Response**:
```json
{
  "message": "Zone updated successfully"
}
```

---

#### 5. Delete Zone
```http
DELETE /api/zones/:id
```

**Response**:
```json
{
  "message": "Zone deleted successfully"
}
```

---

#### 6. Get Zone Polygons
```http
GET /api/zones/:id/polygons
```

**Purpose**: Get polygon boundaries for a zone.

**Response**:
```json
[
  {
    "id": 1,
    "zoneId": 1,
    "coordinates": [
      { "longitude": -74.0060, "latitude": 40.7128 },
      { "longitude": -74.0050, "latitude": 40.7138 },
      { "longitude": -74.0040, "latitude": 40.7118 },
      { "longitude": -74.0060, "latitude": 40.7128 }
    ],
    "wkt": "POLYGON((-74.0060 40.7128, ...))"
  }
]
```

---

#### 7. Create Zone Polygon
```http
POST /api/zones/polygons
Content-Type: application/json

{
  "zoneId": 1,
  "coordinates": [
    { "longitude": -74.0060, "latitude": 40.7128 },
    { "longitude": -74.0050, "latitude": 40.7138 },
    { "longitude": -74.0040, "latitude": 40.7118 },
    { "longitude": -74.0060, "latitude": 40.7128 }
  ]
}
```

**Validation**:
- Minimum 3 coordinates required
- First and last coordinate should be the same (closed polygon)

**Response**:
```json
{
  "message": "Zone polygon created successfully",
  "polygonId": 1
}
```

---

#### 8. Create Multiple Polygons
```http
POST /api/zones/polygons/multiple
Content-Type: application/json

{
  "polygons": [
    {
      "zoneId": 1,
      "coordinates": [
        { "longitude": -74.0060, "latitude": 40.7128 },
        { "longitude": -74.0050, "latitude": 40.7138 },
        { "longitude": -74.0040, "latitude": 40.7118 },
        { "longitude": -74.0060, "latitude": 40.7128 }
      ]
    },
    {
      "zoneId": 1,
      "coordinates": [...]
    }
  ]
}
```

**Response**:
```json
{
  "message": "Zone polygons created successfully",
  "count": 2
}
```

---

#### 9. Delete Zone Polygon
```http
DELETE /api/zones/polygons/:polygonId
```

**Response**:
```json
{
  "message": "Zone polygon deleted successfully"
}
```

---

### Promotions Module (`/api/promotions`)

All promotion endpoints require authentication.

#### 1. List Promotions
```http
GET /api/promotions
Authorization: Bearer <token>
```

**Response**:
```json
[
  {
    "id": 1,
    "titleEnglish": "Summer Sale",
    "titleArabic": "تخفيضات الصيف",
    "descriptionEnglish": "Up to 50% off",
    "descriptionArabic": "خصم يصل إلى 50٪",
    "imageUrl": "https://s3-presigned-url...",
    "actionType": "NAVIGATE_TO_CATEGORY",
    "categoryId": 10,
    "displayOrder": 1,
    "isDisabled": false,
    "createdAt": "2025-01-15T00:00:00Z"
  }
]
```

---

#### 2. Get Promotion by ID
```http
GET /api/promotions/:id
Authorization: Bearer <token>
```

**Response**: Single promotion object with full details

---

#### 3. Create Promotion
```http
POST /api/promotions
Authorization: Bearer <token>
Content-Type: application/json

{
  "titleArabic": "عرض خاص",
  "titleEnglish": "Special Offer",
  "descriptionArabic": "خصم 20٪ على جميع الطلبات",  // Optional
  "descriptionEnglish": "20% off all orders",        // Optional
  "imageKey": "promotions/special-offer.jpg",
  "actionType": "NAVIGATE_TO_CATEGORY",
  "categoryId": 10,                                  // Required for NAVIGATE_TO_CATEGORY
  "displayOrder": 1,                                 // Optional
  "isDisabled": false                                // Optional
}
```

**Action Types and Required Fields**:
1. `NAVIGATE_TO_CATEGORY` - Requires `categoryId`
2. `NAVIGATE_TO_PRODUCT` - Requires `productIds` (array)
3. `OPEN_EXTERNAL_URL` - Requires `externalUrl`
4. `OPEN_DEEPLINK` - Requires `deeplink`
5. `NO_ACTION` - No additional fields required

**Example with Products**:
```json
{
  "titleEnglish": "Featured Products",
  "titleArabic": "منتجات مميزة",
  "imageKey": "promotions/featured.jpg",
  "actionType": "NAVIGATE_TO_PRODUCT",
  "productIds": [101, 205, 310]
}
```

**Response**:
```json
{
  "message": "Promotion created successfully",
  "promotionId": 1
}
```

---

#### 4. Update Promotion
```http
PUT /api/promotions/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**: Same structure as create (all fields optional)

**Response**:
```json
{
  "message": "Promotion updated successfully"
}
```

---

#### 5. Delete Promotion
```http
DELETE /api/promotions/:id
Authorization: Bearer <token>
```

**Response**:
```json
{
  "message": "Promotion deleted successfully"
}
```

---

#### 6. Toggle Promotion Status
```http
PATCH /api/promotions/:id/change-status
Authorization: Bearer <token>
```

**Purpose**: Enable or disable promotion without deleting.

**Response**:
```json
{
  "message": "Promotion status updated successfully",
  "isDisabled": true
}
```

---

### Coupons Module (`/api/coupons`)

#### 1. List Coupons
```http
GET /api/coupons
```

**Response**:
```json
[
  {
    "id": 1,
    "code": "SAVE20",
    "name": "20% Off Summer Sale",
    "description": "Get 20% off on orders above $25",
    "discountType": "PERCENTAGE",
    "discountValue": 20,
    "maxDiscountAmount": 10.00,
    "minOrderAmount": 25.00,
    "startsAt": "2025-06-01T00:00:00Z",
    "endsAt": "2025-08-31T23:59:59Z",
    "isActive": true,
    "maxRedemptions": 1000,
    "currentRedemptions": 234,
    "perUserLimit": 1,
    "applicableMerchantIds": [5, 10, 15],
    "createdAt": "2025-05-01T00:00:00Z"
  }
]
```

---

#### 2. Get Coupon by ID
```http
GET /api/coupons/:id
```

**Response**: Single coupon object

---

#### 3. Create Coupon
```http
POST /api/coupons
Content-Type: application/json

{
  "code": "WELCOME10",
  "name": "Welcome Discount",
  "description": "10% off for new customers",
  "discountType": "PERCENTAGE",        // PERCENTAGE or FIXED_AMOUNT
  "discountValue": 10,
  "maxDiscountAmount": 5.00,           // Optional: cap for percentage
  "minOrderAmount": 15.00,             // Optional: minimum order
  "startsAt": "2025-11-24T00:00:00Z",  // Optional
  "endsAt": "2025-12-31T23:59:59Z",    // Optional
  "isActive": true,
  "maxRedemptions": 500,               // Optional: total usage limit
  "perUserLimit": 1,                   // Optional: per-user limit
  "applicableMerchantIds": [5, 10],    // Optional: restrict to merchants
  "applicableProductIds": [101, 205],  // Optional: restrict to products
  "rules": {                           // Optional: custom rules (JSONB)
    "firstOrderOnly": true,
    "minimumItems": 2
  }
}
```

**Discount Types**:
- `PERCENTAGE` - Percentage discount (e.g., 20% off)
- `FIXED_AMOUNT` - Fixed amount discount (e.g., $5 off)

**Response**:
```json
{
  "message": "Coupon created successfully",
  "couponId": 1
}
```

---

#### 4. Update Coupon
```http
PUT /api/coupons/:id
Content-Type: application/json
```

**Request Body**: Same structure as create (all fields optional)

**Response**:
```json
{
  "message": "Coupon updated successfully"
}
```

---

#### 5. Delete Coupon
```http
DELETE /api/coupons/:id
```

**Response**:
```json
{
  "message": "Coupon deleted successfully"
}
```

---

#### 6. Validate Coupon
```http
POST /api/coupons/validate
Content-Type: application/json

{
  "code": "SAVE20",
  "cartTotal": 30.00,
  "userId": 123,                      // Optional
  "merchantId": 5,                    // Optional
  "cartItemProductIds": [101, 205]    // Optional
}
```

**Purpose**: Check if coupon is valid and applicable.

**Response (Valid)**:
```json
{
  "isValid": true,
  "couponId": 1,
  "discountAmount": 6.00,
  "finalTotal": 24.00,
  "message": "Coupon applied successfully"
}
```

**Response (Invalid)**:
```json
{
  "isValid": false,
  "reason": "minimum_order_not_met",
  "message": "Minimum order amount is $25.00",
  "requiredAmount": 25.00
}
```

**Validation Checks**:
- Coupon exists and is active
- Within valid date range
- Not exceeded max redemptions
- User hasn't exceeded per-user limit
- Cart total meets minimum order amount
- Merchant/product restrictions met

---

#### 7. Get Coupon Usage Statistics
```http
GET /api/coupons/usage?couponId=1&startDate=2025-11-01&endDate=2025-11-30
```

**Query Parameters**:
- `couponId` (number, optional): Filter by coupon
- `startDate` (string, optional): ISO date
- `endDate` (string, optional): ISO date

**Response**:
```json
{
  "totalRedemptions": 234,
  "totalDiscount": 1425.50,
  "averageDiscount": 6.09,
  "uniqueUsers": 198,
  "topMerchants": [
    {
      "merchantId": 5,
      "merchantName": "Pizza Palace",
      "redemptions": 45
    }
  ]
}
```

---

### App-Config Module (`/api/app-config`)

#### 1. Get Home Configuration
```http
GET /api/app-config/home-customer
```

**Purpose**: Retrieve dynamic home page configuration (public endpoint).

**Response**:
```json
{
  "ttl_seconds": 300,
  "sections": [
    {
      "id": "hero_carousel",
      "component": "carousel",
      "title": "Featured Deals",
      "layout": {
        "height": 200,
        "autoScroll": true,
        "showDots": true
      },
      "data_source": {
        "entity": "promotion",
        "manual_ids": [1, 2, 3]
      }
    },
    {
      "id": "nearby_merchants",
      "component": "vertical_feed",
      "title": "Nearby Restaurants",
      "layout": {
        "card": "merchant_large"
      },
      "data_source": {
        "entity": "merchant",
        "filters": {
          "near": { "lat": "auto", "lng": "auto" },
          "radius_km": 5
        },
        "sort": [
          { "field": "featured_score", "dir": "desc" }
        ],
        "limit": 20
      }
    }
  ]
}
```

---

#### 2. Update Home Configuration
```http
POST /api/app-config/home-customer
Authorization: Bearer <token>
Content-Type: application/json

{
  "ttl_seconds": 300,
  "sections": [...]
}
```

**Component Types**:
- `carousel` - Image carousel/slider
- `grid` - Grid layout
- `horizontal_list` - Horizontal scrollable list
- `vertical_feed` - Vertical scrolling feed
- `logo_strip` - Brand logo strip

**Entity Types**:
- `merchant` - Restaurants/merchants
- `product` - Menu items
- `promotion` - Promotional offers

**Data Source Options**:

**1. Manual Selection**:
```json
{
  "entity": "promotion",
  "manual_ids": [1, 5, 8, 12]
}
```

**2. Dynamic Filters**:
```json
{
  "entity": "merchant",
  "filters": {
    "city": "auto",
    "is_open": true,
    "has_discount": true
  },
  "sort": [
    { "field": "rating", "dir": "desc" }
  ],
  "limit": 10
}
```

**3. Hybrid (Manual + Filters)**:
```json
{
  "entity": "promotion",
  "manual_ids": [3, 7, 15],
  "filters": {
    "is_active": true
  }
}
```

**Complete Example**:
```json
{
  "ttl_seconds": 300,
  "sections": [
    {
      "id": "hero_carousel",
      "component": "carousel",
      "layout": {
        "height": 180,
        "autoScroll": true,
        "showDots": true
      },
      "data_source": {
        "entity": "promotion",
        "manual_ids": [1, 2, 3]
      }
    },
    {
      "id": "daily_deals",
      "component": "horizontal_list",
      "title": "Daily Discounts",
      "subtitle": "Up to 50% OFF",
      "layout": {
        "card": "merchant_compact",
        "itemWidth": 280,
        "showMore": { "route": "/deals" }
      },
      "data_source": {
        "entity": "merchant",
        "filters": { "has_discount": true },
        "sort": [{ "field": "discount_pct", "dir": "desc" }],
        "limit": 10
      }
    },
    {
      "id": "popular_items",
      "component": "horizontal_list",
      "title": "Popular items",
      "layout": {
        "card": "product",
        "itemWidth": 220
      },
      "data_source": {
        "entity": "product",
        "filters": {
          "popularity_window_days": 14
        },
        "sort": [
          { "field": "popularity_score", "dir": "desc" }
        ],
        "limit": 12
      }
    }
  ]
}
```

**Response**:
```json
{
  "message": "Home configuration updated successfully"
}
```

**Best Practices**:
1. Use manual IDs for curated content
2. Use dynamic sources for real-time content
3. Set appropriate TTL based on content change frequency
4. Limit results to optimize performance
5. Use `"auto"` for user location-based filtering

For complete app-config documentation, see: [apps/management_api/src/modules/app-config/README.md](apps/management_api/src/modules/app-config/README.md)

---

## Missing Features Analysis

### Critical Missing Features

#### 1. **Role-Based Access Control (RBAC)** ⚠️ CRITICAL
**Impact**: All management users have full access to all operations.

**What's Missing**:
- Role definitions (Super Admin, Admin, Content Manager, Support)
- Permission system
- Role assignment
- Route-level permission checks
- Activity audit based on roles

**API Endpoints Needed**:
```
GET /api/roles
POST /api/roles
PUT /api/roles/:id
DELETE /api/roles/:id
GET /api/users/management
POST /api/users/management
PUT /api/users/management/:id/role
GET /api/permissions
POST /api/roles/:id/permissions
```

---

#### 2. **Analytics & Reporting Dashboard** ⚠️ CRITICAL
**Impact**: No visibility into platform metrics and performance.

**What's Missing**:
- Platform-wide analytics
- Merchant performance metrics
- Customer behavior analytics
- Revenue and commission tracking
- Order volume trends
- Popular products/categories
- Geographic distribution
- Export functionality

**API Endpoints Needed**:
```
GET /api/analytics/overview
GET /api/analytics/merchants?period=monthly
GET /api/analytics/customers?period=weekly
GET /api/analytics/orders?startDate&endDate
GET /api/analytics/revenue?period=monthly
GET /api/analytics/popular-products?limit=20
GET /api/analytics/geographic-distribution
POST /api/analytics/export?format=csv&report=revenue
```

---

#### 3. **Order Management** ⚠️ CRITICAL
**Impact**: Cannot view or manage platform orders.

**What's Missing**:
- View all platform orders
- Order details and tracking
- Refund management
- Dispute resolution
- Order status updates
- Customer support for orders
- Bulk order operations

**API Endpoints Needed**:
```
GET /api/orders?status&merchantId&customerId&startDate&endDate
GET /api/orders/:id
PUT /api/orders/:id/status
POST /api/orders/:id/refund
GET /api/orders/:id/timeline
POST /api/orders/:id/notes
GET /api/orders/disputes
PUT /api/orders/disputes/:id/resolve
```

---

#### 4. **Payment & Financial Management** ⚠️ CRITICAL
**Impact**: No visibility into payments, payouts, or financial operations.

**What's Missing**:
- Payment gateway integration management
- Transaction monitoring
- Payout schedule to merchants
- Commission tracking
- Financial reports
- Failed payment handling
- Refund processing

**API Endpoints Needed**:
```
GET /api/payments/transactions?startDate&endDate
GET /api/payments/merchants/:id/payouts
POST /api/payments/merchants/:id/payout
GET /api/payments/commissions?period=monthly
GET /api/payments/failed
POST /api/payments/:id/retry
GET /api/payments/refunds
GET /api/financial/reports?type=revenue&period=monthly
```

---

#### 5. **Notification Management** ⚠️ HIGH
**Impact**: Cannot send announcements or manage notifications.

**What's Missing**:
- Send platform-wide announcements
- Targeted notifications (by segment)
- Email campaign management
- Push notification management
- SMS management
- Notification templates
- Scheduled notifications

**API Endpoints Needed**:
```
POST /api/notifications/broadcast
POST /api/notifications/targeted
GET /api/notifications/templates
POST /api/notifications/templates
PUT /api/notifications/templates/:id
POST /api/notifications/schedule
GET /api/notifications/scheduled
GET /api/notifications/history
```

---

#### 6. **Content Moderation** ⚠️ HIGH
**Impact**: Cannot moderate user-generated content.

**What's Missing**:
- Review moderation (approve/reject)
- Report management
- Inappropriate content flagging
- Merchant content review
- Product content validation
- Image moderation

**API Endpoints Needed**:
```
GET /api/moderation/reviews?status=pending
PUT /api/moderation/reviews/:id/approve
PUT /api/moderation/reviews/:id/reject
GET /api/moderation/reports
GET /api/moderation/reports/:id
PUT /api/moderation/reports/:id/resolve
GET /api/moderation/merchants/pending-content
```

---

#### 7. **Customer Support System** ⚠️ HIGH
**Impact**: No integrated support ticketing system.

**What's Missing**:
- Support ticket management
- Customer inquiry handling
- Live chat support
- Ticket assignment
- SLA tracking
- Canned responses
- Support analytics

**API Endpoints Needed**:
```
GET /api/support/tickets?status&priority&assignedTo
GET /api/support/tickets/:id
POST /api/support/tickets/:id/reply
PUT /api/support/tickets/:id/assign
PUT /api/support/tickets/:id/close
GET /api/support/canned-responses
POST /api/support/canned-responses
GET /api/support/analytics
```

---

#### 8. **Audit Trail & Logs** ⚠️ MEDIUM
**Impact**: No visibility into who changed what and when.

**What's Missing**:
- Activity logging
- Change history
- User action tracking
- Security event logging
- Compliance audit trail
- Log search and filtering

**API Endpoints Needed**:
```
GET /api/audit/logs?userId&action&resource&startDate&endDate
GET /api/audit/logs/:id
GET /api/audit/changes/:resourceType/:resourceId
GET /api/audit/security-events
POST /api/audit/export
```

---

#### 9. **System Configuration** ⚠️ MEDIUM
**Impact**: Cannot configure platform-wide settings.

**What's Missing**:
- Platform settings management
- Feature flags
- Maintenance mode
- API rate limiting configuration
- Email/SMS provider settings
- Payment gateway settings
- Currency and locale settings

**API Endpoints Needed**:
```
GET /api/settings
PUT /api/settings/:key
GET /api/settings/feature-flags
PUT /api/settings/feature-flags/:flag
POST /api/settings/maintenance-mode
GET /api/settings/integrations
PUT /api/settings/integrations/:type
```

---

#### 10. **Marketing Tools** ⚠️ MEDIUM
**Impact**: Limited marketing campaign capabilities.

**What's Missing**:
- Email campaign builder
- SMS campaigns
- Customer segmentation
- A/B testing
- Campaign analytics
- Referral program management
- Loyalty program configuration

**API Endpoints Needed**:
```
POST /api/marketing/campaigns
GET /api/marketing/campaigns
GET /api/marketing/campaigns/:id/analytics
GET /api/marketing/segments
POST /api/marketing/segments
POST /api/marketing/ab-tests
GET /api/marketing/referrals
PUT /api/marketing/loyalty/config
```

---

#### 11. **Delivery Management** ⚠️ MEDIUM
**Impact**: No delivery driver or fleet management.

**What's Missing**:
- Driver management
- Fleet management
- Delivery assignments
- Real-time tracking
- Driver performance
- Delivery zones optimization

**API Endpoints Needed**:
```
GET /api/delivery/drivers
POST /api/delivery/drivers
GET /api/delivery/drivers/:id/performance
GET /api/delivery/assignments
POST /api/delivery/assignments
GET /api/delivery/tracking/:orderId
GET /api/delivery/fleet-analytics
```

---

#### 12. **Bulk Operations** ⚠️ LOW
**Impact**: Time-consuming manual operations.

**What's Missing**:
- Bulk merchant approval/rejection
- Bulk coupon creation
- Bulk zone assignments
- Bulk category updates
- Import/export functionality

**API Endpoints Needed**:
```
POST /api/bulk/merchants/approve
POST /api/bulk/merchants/assign-zones
POST /api/bulk/coupons/create
POST /api/bulk/categories/import
GET /api/bulk/export?resource=merchants
```

---

## Proposed New Features

### Innovative Management Platform Features

#### 1. **AI-Powered Fraud Detection** 🤖
Detect and prevent fraudulent activities automatically.

**Features**:
- Suspicious order pattern detection
- Fake review identification
- Merchant fraud detection
- Payment fraud prevention
- Automated risk scoring
- Real-time alerts

**API Endpoints**:
```
GET /api/fraud/alerts?severity=high
GET /api/fraud/merchants/:id/risk-score
GET /api/fraud/orders/:id/analysis
POST /api/fraud/rules
PUT /api/fraud/alerts/:id/resolve
GET /api/fraud/analytics
```

---

#### 2. **Smart Commission Engine** 💰
Dynamic commission management based on multiple factors.

**Features**:
- Tiered commission structure
- Performance-based commissions
- Zone-based commissions
- Category-based commissions
- Promotional commission adjustments
- Automatic calculation
- Commission analytics

**API Endpoints**:
```
GET /api/commissions/rules
POST /api/commissions/rules
PUT /api/commissions/rules/:id
GET /api/commissions/merchants/:id/calculate
GET /api/commissions/analytics?period=monthly
POST /api/commissions/adjustments
```

---

#### 3. **Merchant Performance Dashboard** 📊
Comprehensive merchant analytics and insights.

**Features**:
- Performance scorecards
- Quality metrics
- Customer satisfaction scores
- Order fulfillment metrics
- Response time tracking
- Automated performance alerts
- Benchmarking against peers

**API Endpoints**:
```
GET /api/merchants/:id/performance
GET /api/merchants/:id/scorecard
GET /api/merchants/:id/quality-metrics
GET /api/merchants/:id/benchmarks
GET /api/merchants/leaderboard?metric=rating
POST /api/merchants/:id/performance-review
```

---

#### 4. **Automated Compliance Monitoring** ✅
Ensure regulatory and platform compliance.

**Features**:
- License expiry tracking
- Health inspection tracking
- Document verification
- Compliance alerts
- Automated reminders
- Penalty management

**API Endpoints**:
```
GET /api/compliance/merchants?status=expiring
GET /api/compliance/merchants/:id/documents
POST /api/compliance/merchants/:id/verify
GET /api/compliance/alerts
POST /api/compliance/penalties
GET /api/compliance/reports
```

---

#### 5. **Dynamic Pricing Recommendations** 💡
AI-powered pricing optimization suggestions.

**Features**:
- Demand-based pricing suggestions
- Competitive pricing analysis
- Surge pricing recommendations
- Discount optimization
- Price elasticity analysis

**API Endpoints**:
```
GET /api/pricing/recommendations?merchantId=5
GET /api/pricing/competitive-analysis?category=10
POST /api/pricing/surge-rules
GET /api/pricing/elasticity-analysis
```

---

#### 6. **Customer Lifetime Value (CLV) Analytics** 📈
Deep customer insights and segmentation.

**Features**:
- CLV calculation
- Customer segmentation
- Churn prediction
- Retention analytics
- High-value customer identification
- Personalization insights

**API Endpoints**:
```
GET /api/customers/clv?segment=high-value
GET /api/customers/:id/clv-analysis
GET /api/customers/churn-prediction
GET /api/customers/segments
POST /api/customers/segments
GET /api/customers/retention-analytics
```

---

#### 7. **Multi-Tenant Management** 🏢
Manage multiple sub-platforms or brands.

**Features**:
- White-label configurations
- Brand-specific settings
- Isolated data and operations
- Cross-brand analytics
- Tenant billing

**API Endpoints**:
```
GET /api/tenants
POST /api/tenants
GET /api/tenants/:id/config
PUT /api/tenants/:id/branding
GET /api/tenants/:id/analytics
POST /api/tenants/:id/billing
```

---

#### 8. **Predictive Demand Forecasting** 🔮
Predict demand and optimize operations.

**Features**:
- Order volume prediction
- Peak time forecasting
- Seasonal trend analysis
- Zone demand prediction
- Resource allocation suggestions

**API Endpoints**:
```
GET /api/forecasting/demand?zone=1&date=2025-12-25
GET /api/forecasting/peak-times?merchant=5
GET /api/forecasting/seasonal-trends
GET /api/forecasting/zone-demand
```

---

#### 9. **Automated Merchant Onboarding** 🚀
Streamline merchant approval with automation.

**Features**:
- Document verification (OCR)
- Automated background checks
- Risk assessment
- Auto-approval for low-risk
- Onboarding workflow customization

**API Endpoints**:
```
POST /api/onboarding/merchants/:id/auto-verify
GET /api/onboarding/merchants/:id/risk-assessment
PUT /api/onboarding/workflows
GET /api/onboarding/status/:merchantId
```

---

#### 10. **Intelligent Routing & Assignment** 🗺️
Optimize delivery and order routing.

**Features**:
- Smart zone assignment
- Driver-order matching
- Route optimization
- Load balancing
- Traffic-aware routing

**API Endpoints**:
```
POST /api/routing/optimize?orderId=5001
GET /api/routing/zone-suggestions?lat=40.7128&lng=-74.0060
POST /api/routing/driver-assignment
GET /api/routing/analytics
```

---

## Implementation Roadmap

### Phase 1: Critical Platform Operations (Months 1-3)

**Priority: CRITICAL**

1. **Role-Based Access Control**
   - Define roles and permissions
   - Implement authorization checks
   - Activity audit logging

2. **Order Management**
   - View all platform orders
   - Order details and tracking
   - Refund processing
   - Dispute resolution

3. **Analytics Dashboard**
   - Overview metrics
   - Merchant analytics
   - Customer analytics
   - Revenue reports

4. **Payment & Financial Management**
   - Transaction monitoring
   - Merchant payouts
   - Commission tracking

**Expected Outcome**: Platform operators can manage core operations effectively.

---

### Phase 2: Enhanced Governance (Months 4-6)

**Priority: HIGH**

1. **Notification Management**
2. **Content Moderation**
3. **Customer Support System**
4. **Audit Trail & Logs**
5. **System Configuration**

**Expected Outcome**: Complete governance and control over platform.

---

### Phase 3: Growth & Optimization (Months 7-9)

**Priority: MEDIUM**

1. **Marketing Tools**
2. **Delivery Management**
3. **Bulk Operations**
4. **Merchant Performance Dashboard**
5. **Compliance Monitoring**

**Expected Outcome**: Scalable operations and growth tools.

---

### Phase 4: Advanced Intelligence (Months 10-12)

**Priority: NICE TO HAVE**

1. **AI-Powered Fraud Detection**
2. **Smart Commission Engine**
3. **Dynamic Pricing Recommendations**
4. **CLV Analytics**
5. **Predictive Demand Forecasting**
6. **Intelligent Routing**

**Expected Outcome**: AI-powered platform with competitive advantages.

---

## Best Practices

### Security Best Practices

**1. Authentication**
- Store passwords using bcrypt (minimum 10 rounds)
- Implement token rotation
- Add rate limiting on auth endpoints
- Monitor for brute force attempts

**2. Authorization**
- Implement RBAC as soon as possible
- Validate permissions on every request
- Use principle of least privilege
- Audit all sensitive operations

**3. Data Protection**
- Never log sensitive data
- Encrypt data at rest
- Use HTTPS only
- Implement request signing for webhooks

---

### API Design Standards

**1. Consistent Response Format**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2025-11-23T18:00:00Z"
  }
}
```

**2. Pagination**
```json
{
  "items": [...],
  "totalCount": 150,
  "page": 1,
  "pageSize": 20,
  "totalPages": 8
}
```

**3. Error Handling**
```json
{
  "success": false,
  "error": {
    "code": "MERCHANT_NOT_FOUND",
    "message": "Merchant with ID 456 not found",
    "statusCode": 404
  }
}
```

---

### Database Best Practices

**1. Use Stored Procedures**
- Centralize business logic
- Improve performance
- Better security
- Easier maintenance

**2. Indexing Strategy**
- Index foreign keys
- Index frequently queried columns
- Composite indexes for multi-column queries
- Monitor query performance

**3. Data Integrity**
- Use transactions for multi-step operations
- Implement proper constraints
- Regular backups
- Point-in-time recovery

---

## Deployment Guide

### Environment Variables

```env
# Server
NODE_ENV=production
PORT=3003

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=namnam
DB_USER=postgres
DB_PASSWORD=secure_password

# JWT
JWT_SECRET=your-secret-key-512-bits
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=30d

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET=namnam-management

# CORS
CORS_ORIGIN=https://admin.namnam.com

# File Upload
MAX_FILE_SIZE=2097152  # 2MB in bytes
```

---

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3003

CMD ["node", "dist/main"]
```

---

## Appendix

### HTTP Status Codes
| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful operation |
| 201 | Created | Resource created |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable | Validation failed |
| 500 | Server Error | Internal error |

---

### Database Stored Procedures Reference

**Auth**:
- `insert_management_user` - Create management user
- `select_management_user` - Get user by email

**Users**:
- `select_management_customers` - Paginated customer list
- `select_management_merchants` - Paginated merchant list

**Merchants**:
- `select_management_merchants` - List merchants
- `select_merchant_info_management` - Get merchant info
- `approve_merchant` - Approve merchant
- `suspend_merchant` - Suspend merchant
- `delete_merchant` - Delete merchant
- `update_merchant_status` - Update status & zone

**Categories**:
- `select_categories` - List categories
- `create_category` - Create category
- `update_category` - Update category
- `delete_category` - Delete category

**Zones**:
- `select_zones` - List zones
- `create_zone` - Create zone
- `update_zone` - Update zone
- `delete_zone` - Delete zone
- `create_zone_polygon` - Create polygon
- `delete_zone_polygon` - Delete polygon

**Promotions**:
- `select_promotions_management` - List promotions
- `insert_promotion_management` - Create promotion
- `update_promotion_management` - Update promotion
- `delete_promotion_management` - Delete promotion
- `update_promotion_status_management` - Toggle status

**Coupons**:
- `select_coupons_management` - List coupons
- `create_coupon_management` - Create coupon
- `update_coupon_management` - Update coupon
- `delete_coupon_management` - Delete coupon
- `validate_coupon_management` - Validate coupon

**App Config**:
- `select_app_config` - Get configuration
- `upsert_app_config` - Update configuration

---

**API Version:** 1.0.0
**Last Updated:** November 23, 2025
**Maintained By:** NamNam Platform Development Team
**Next Review:** December 23, 2025
