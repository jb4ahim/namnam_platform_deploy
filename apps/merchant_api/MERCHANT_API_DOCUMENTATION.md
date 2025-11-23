
# Merchant API - Complete Documentation

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

The Merchant API is a comprehensive NestJS-based service that powers the merchant/restaurant-facing functionality of the NamNam platform. It provides complete solutions for restaurant owners to manage their business operations, including menu management, order fulfillment, and profile configuration.

### Key Specifications
- **Framework**: NestJS with Fastify adapter
- **Database**: PostgreSQL with stored procedures
- **Authentication**: JWT-based with phone OTP + password
- **Port**: 3001
- **API Prefix**: `/api`
- **Total Endpoints**: 27+
- **Storage**: AWS S3 for images

**Technology Stack:**
- Framework: NestJS with Fastify adapter
- Database: PostgreSQL with stored procedures
- Authentication: JWT-based with OTP + Password
- Validation: class-validator with global pipes
- Port: 3001 (configurable)
- API Prefix: `/api`
- Storage: AWS S3 (presigned URLs)

> Reality checks: OTP verification currently uses a hardcoded code (`123456`); password uses bcrypt with salt rounds 10; FCM tokens are stored for push notifications.

### Core Capabilities
- Phone-based authentication with password security
- Restaurant profile and information management
- Operating hours scheduling
- Contact person management
- Location management with GPS
- Menu catalog organization (sections)
- Product/menu item management with variations
- Order receiving and fulfillment
- Shipping and tracking management
- Order notes and refunds
- Bilingual support (Arabic & English)

---

## Architecture

### Technology Stack
```
┌─────────────────────────────────────┐
│         NestJS Application          │
├─────────────────────────────────────┤
│  Fastify HTTP Server (Port 3001)    │
├─────────────────────────────────────┤
│      Global Middleware Layer        │
│  - ValidationPipe                   │
│  - ResponseEnvelopeInterceptor      │
│  - GlobalExceptionFilter            │
│  - CORS                             │
│  - AuthGuard (JWT)                  │
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
│  (Product/Restaurant Images)      │
└───────────────────────────────────┘
```

### Module Organization

| Module | Purpose | Auth Required | Key Features |
|--------|---------|---------------|--------------|
| Auth | Merchant authentication & registration | Partial | OTP, Password, JWT tokens, FCM |
| Merchant | Restaurant profile management | Yes | Info, Schedule, Contacts, Location, Approval |
| Products | Menu item management | Yes | CRUD, Variations, Images, Pricing |
| Catalog | Menu section organization | Yes | Sections for organizing products |
| Orders | Order fulfillment & management | Yes | Status updates, Shipping, Refunds, Notes |

### Design Patterns

- **Repository Pattern**: Data access layer abstracted through repositories
- **Service Pattern**: Business logic encapsulated in services
- **DTO Pattern**: Data validation via Data Transfer Objects
- **Dependency Injection**: NestJS built-in DI container
- **Stored Procedures**: All database operations via PostgreSQL functions

---

## Authentication

### Flow Overview
```
1. Merchant enters phone number
   ↓
2. POST /api/auth/send-otp
   ↓
3. OTP sent to phone (hardcoded: '123456' for testing)
   ↓
4. Merchant enters OTP
   ↓
5. POST /api/auth/verify-otp
   ↓
6. Returns: verifyToken (temporary token for new users)
         OR accessToken + refreshToken (existing users)
   ↓
7. If new: POST /api/auth/password (register with password)
   If existing: Use tokens for authenticated requests
   ↓
8. Returns: accessToken, refreshToken
   ↓
9. Use access token for all authenticated requests
```

> Reality check: `send-otp` accepts valid phone format; `verify-otp` returns `{ verifyToken, expiresAt }` for new merchants or `{ accessToken, refreshToken, user }` for existing; `password` endpoint handles both registration (requires verifyToken) and login (requires phone+password).

### Security Features
- **OTP Verification**: Phone number validation before registration
- **Password Protection**: Bcrypt hashing (salt rounds: 10)
- **JWT Tokens**: Dual-token system (access + refresh)
- **Token Expiry**: Access tokens expire after 1 day
- **FCM Integration**: Push notification token management
- **Locale Support**: Multi-language preference storage (en/ar)

### Protected Endpoints
All endpoints except authentication flow require the `Authorization` header:
```
Authorization: Bearer <access_token>
```

The `AuthGuard` extracts `userId` and `merchantId` from JWT for authorization.

---

## API Endpoints Reference

### Auth Module (`/api/auth`)

#### 1. Send OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "countryCode": "+1",        // Pattern: ^\+\d{1,4}$
  "phoneNumber": "1234567890" // Pattern: ^\d{6,15}$
}
```

**Response:**
```json
{
  "message": "OTP sent successfully"
}
```

**Notes**: Currently uses hardcoded OTP '123456' for testing purposes.

---

#### 2. Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "countryCode": "+1",
  "phoneNumber": "1234567890",
  "code": "123456"           // Exactly 6 characters
}
```

**Response (New Merchant)**:
```json
{
  "verifyToken": "eyJhbGc...",
  "expiresAt": "2025-11-23T19:00:00Z"
}
```

**Response (Existing Merchant)**:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": 123,
    "merchantId": 456,
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "1234567890",
    "countryCode": "+1"
  }
}
```

**Error Cases**:
- Invalid OTP: 401 Unauthorized
- Expired OTP: 401 Unauthorized

---

#### 3. Register/Login with Password
```http
POST /api/auth/password
Content-Type: application/json
```

**Request Body (Registration - New Merchant)**:
```json
{
  "verifyToken": "eyJhbGc...",  // From verify-otp response
  "password": "SecurePass123!",  // Min 8 characters
  "firstName": "John",
  "lastName": "Doe"
}
```

**Request Body (Login - Existing Merchant)**:
```json
{
  "countryCode": "+1",
  "phoneNumber": "1234567890",
  "password": "SecurePass123!"
}
```

**Response**:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": 123,
    "merchantId": 456,
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "1234567890",
    "countryCode": "+1"
  }
}
```

**Validation**:
- Password: Min 8 characters
- First/Last name: Required for registration
- VerifyToken: Required for registration, must be valid and not expired

---

#### 4. Refresh Token
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

#### 5. Update FCM Token
```http
POST /api/auth/fcm-token
Authorization: Bearer <token>
Content-Type: application/json

{
  "fcmToken": "firebase-device-token-here"
}
```

**Purpose**: Updates Firebase Cloud Messaging token for push notifications.

**Response**:
```json
{
  "message": "FCM token updated successfully"
}
```

---

#### 6. Set Locale
```http
POST /api/auth/set-locale
Authorization: Bearer <token>
Content-Type: application/json

{
  "locale": "en"  // 'en' or 'ar'
}
```

**Purpose**: Sets merchant's preferred language/locale.

**Response**:
```json
{
  "message": "Locale updated successfully"
}
```

---

### Merchant Module (`/api/merchants`)

All merchant endpoints require authentication.

#### 1. Get Merchant Information
```http
GET /api/merchants/info
Authorization: Bearer <token>
```

**Purpose**: Retrieves restaurant/merchant profile information.

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
  "status": "active",
  "approvalStatus": "pending",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

---

#### 2. Create Merchant Information
```http
POST /api/merchants/info
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Pizza Palace",
  "description": "Authentic Italian pizza and pasta",
  "coverKey": "merchants/456/cover.jpg",     // S3 key
  "imageKey": "merchants/456/logo.jpg",      // S3 key
  "categoryId": 10,
  "hotline": "+11234567890"
}
```

**Response**:
```json
{
  "message": "Merchant information created successfully",
  "merchantId": 456
}
```

**Validation**:
- name: Required string
- description: Required string
- coverKey: Required S3 key
- imageKey: Required S3 key
- categoryId: Required number
- hotline: Required, valid phone format

> Note: Images must be uploaded to S3 first; provide the S3 keys here.

---

#### 3. Get Weekly Schedule
```http
GET /api/merchants/schedules
Authorization: Bearer <token>
```

**Purpose**: Retrieves restaurant operating hours for the week.

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
      "day": "Tuesday",
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

#### 4. Create Weekly Schedule
```http
POST /api/merchants/schedules
Authorization: Bearer <token>
Content-Type: application/json

{
  "weeklySchedule": [
    {
      "day": "Monday",
      "isOpen": true,
      "open": "09:00",     // Required if isOpen=true
      "close": "22:00"     // Required if isOpen=true
    },
    {
      "day": "Tuesday",
      "isOpen": true,
      "open": "09:00",
      "close": "22:00"
    },
    {
      "day": "Wednesday",
      "isOpen": true,
      "open": "09:00",
      "close": "22:00"
    },
    {
      "day": "Thursday",
      "isOpen": true,
      "open": "09:00",
      "close": "22:00"
    },
    {
      "day": "Friday",
      "isOpen": true,
      "open": "09:00",
      "close": "23:00"
    },
    {
      "day": "Saturday",
      "isOpen": true,
      "open": "10:00",
      "close": "23:00"
    },
    {
      "day": "Sunday",
      "isOpen": false
    }
  ]
}
```

**Response**:
```json
{
  "message": "Weekly schedule created successfully"
}
```

**Validation**:
- Must include all 7 days
- Time format: HH:MM (24-hour)
- If isOpen=true, both open and close times required
- Close time must be after open time

---

#### 5. Get Contact Persons
```http
GET /api/merchants/contact-person
Authorization: Bearer <token>
```

**Purpose**: Retrieves list of contact persons for the restaurant.

**Response**:
```json
[
  {
    "id": 1,
    "name": "John Manager",
    "phone": "+11234567890",
    "email": "john@pizzapalace.com",
    "position": "Manager",
    "isPrimary": true,
    "createdAt": "2025-01-15T10:00:00Z"
  }
]
```

---

#### 6. Create Contact Person
```http
POST /api/merchants/contact-person
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Staff",
  "phone": "+10987654321",
  "email": "jane@pizzapalace.com",
  "position": "Assistant Manager",
  "isPrimary": false
}
```

**Response**:
```json
{
  "message": "Contact person created successfully",
  "contactId": 2
}
```

**Validation**:
- name: Required
- phone: Required, valid format
- email: Optional, valid email if provided
- position: Optional
- isPrimary: Optional, boolean

---

#### 7. Get Categories
```http
GET /api/merchants/categories
Authorization: Bearer <token>
```

**Purpose**: Retrieves available restaurant categories with images.

**Response**:
```json
[
  {
    "id": 10,
    "name": "Italian",
    "nameAr": "إيطالي",
    "description": "Italian cuisine",
    "imageUrl": "https://s3-presigned-url...",
    "icon": "pizza-icon",
    "isActive": true
  },
  {
    "id": 11,
    "name": "Chinese",
    "nameAr": "صيني",
    "description": "Chinese cuisine",
    "imageUrl": "https://s3-presigned-url...",
    "icon": "noodle-icon",
    "isActive": true
  }
]
```

**Notes**: Image URLs are presigned S3 URLs with expiration (typically 1 hour).

---

#### 8. Create Location
```http
POST /api/merchants/location
Authorization: Bearer <token>
Content-Type: application/json

{
  "address": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "buildingNumber": "123",
  "floor": "Ground",
  "apartmentNumber": "A1",
  "landmarks": "Near Central Park",
  "imageKeys": [
    "merchants/456/location1.jpg",
    "merchants/456/location2.jpg"
  ]
}
```

**Response**:
```json
{
  "message": "Location created successfully",
  "locationId": 789
}
```

**Validation**:
- address, city, state: Required
- latitude, longitude: Required for delivery distance calculations
- imageKeys: Optional array of S3 keys

---

#### 9. Get Location
```http
GET /api/merchants/location
Authorization: Bearer <token>
```

**Purpose**: Retrieves restaurant location details.

**Response**:
```json
{
  "id": 789,
  "address": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "buildingNumber": "123",
  "floor": "Ground",
  "apartmentNumber": "A1",
  "landmarks": "Near Central Park",
  "images": [
    "https://s3-presigned-url..."
  ],
  "createdAt": "2025-01-15T10:00:00Z"
}
```

---

#### 10. Request Approval
```http
POST /api/merchants/request-approval
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "All information has been completed and verified"
}
```

**Purpose**: Submits restaurant for platform approval.

**Response**:
```json
{
  "message": "Approval request submitted successfully",
  "requestId": 101,
  "status": "pending"
}
```

**Prerequisites**:
- Merchant info must be complete
- Weekly schedule must be set
- At least one contact person
- Location must be added

**Approval Flow**:
- pending → under_review → approved/rejected

---

### Catalog Module (`/api/catalog`)

All catalog endpoints require authentication.

#### 1. Get Sections
```http
GET /api/catalog/sections
Authorization: Bearer <token>
```

**Purpose**: Retrieves all menu sections for organizing products.

**Response**:
```json
[
  {
    "id": 1,
    "name": "Breakfast",
    "nameAr": "فطور",
    "displayOrder": 1,
    "productCount": 12,
    "isActive": true,
    "createdAt": "2025-01-15T10:00:00Z"
  },
  {
    "id": 2,
    "name": "Main Course",
    "nameAr": "الطبق الرئيسي",
    "displayOrder": 2,
    "productCount": 25,
    "isActive": true,
    "createdAt": "2025-01-15T10:00:00Z"
  }
]
```

---

#### 2. Create Section
```http
POST /api/catalog/sections
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Desserts",
  "nameAr": "حلويات",
  "displayOrder": 3
}
```

**Response**:
```json
{
  "message": "Section created successfully",
  "sectionId": 3
}
```

**Validation**:
- name: Required (English)
- nameAr: Required (Arabic)
- displayOrder: Optional, defaults to last

---

#### 3. Update Section
```http
PUT /api/catalog/sections/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sweet Treats",
  "nameAr": "حلويات لذيذة",
  "displayOrder": 4
}
```

**Path Parameters**:
- `id` (number): Section ID

**Response**:
```json
{
  "message": "Section updated successfully"
}
```

---

### Products Module (`/api/products`)

All product endpoints require authentication.

#### 1. List Products
```http
GET /api/products?sectionId=1
Authorization: Bearer <token>
```

**Purpose**: Retrieves all menu items for the merchant.

**Query Parameters**:
- `sectionId` (number, optional): Filter by section

**Response**:
```json
[
  {
    "id": 101,
    "sectionId": 1,
    "sectionName": "Breakfast",
    "name": "Margherita Pizza",
    "nameAr": "بيتزا مارغريتا",
    "description": "Classic tomato and mozzarella",
    "descriptionAr": "طماطم وموزاريلا كلاسيكية",
    "price": 12.99,
    "images": [
      "https://s3-presigned-url..."
    ],
    "categoryIds": [10, 15],
    "isEnabled": true,
    "hasVariations": true,
    "hasGroupChoices": true,
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-20T14:00:00Z"
  }
]
```

---

#### 2. Get Product by ID
```http
GET /api/products/:id
Authorization: Bearer <token>
```

**Path Parameters**:
- `id` (number): Product ID

**Response**:
```json
{
  "id": 101,
  "sectionId": 1,
  "sectionName": "Breakfast",
  "name": "Margherita Pizza",
  "nameAr": "بيتزا مارغريتا",
  "description": "Classic tomato and mozzarella pizza",
  "descriptionAr": "بيتزا طماطم وموزاريلا كلاسيكية",
  "price": 12.99,
  "images": [
    "https://s3-presigned-url..."
  ],
  "categoryIds": [10, 15],
  "isEnabled": true,
  "variations": {
    "variationTitle": "Size",
    "variationTitleAr": "الحجم",
    "options": [
      {
        "name": "Small",
        "nameAr": "صغير",
        "price": 0
      },
      {
        "name": "Large",
        "nameAr": "كبير",
        "price": 5.00
      }
    ]
  },
  "groupChoices": [
    {
      "groupName": "Toppings",
      "groupNameAr": "الإضافات",
      "maximumChoices": 3,
      "choices": [
        {
          "name": "Extra Cheese",
          "nameAr": "جبن إضافي",
          "price": 2.00
        },
        {
          "name": "Mushrooms",
          "nameAr": "فطر",
          "price": 1.50
        }
      ]
    }
  ],
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-20T14:00:00Z"
}
```

---

#### 3. Create Product
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "sectionId": 1,
  "imageKeys": [
    "products/101/image1.jpg",
    "products/101/image2.jpg"
  ],
  "price": 12.99,
  "productNameArabic": "بيتزا مارغريتا",
  "productNameEnglish": "Margherita Pizza",
  "productDescriptionArabic": "بيتزا طماطم وموزاريلا كلاسيكية",
  "productDescriptionEnglish": "Classic tomato and mozzarella pizza",
  "categoryIds": [10, 15],
  "variations": {
    "variationTitle": "Size",
    "variationTitleAr": "الحجم",
    "options": [
      {
        "name": "Small",
        "nameAr": "صغير",
        "price": 0
      },
      {
        "name": "Large",
        "nameAr": "كبير",
        "price": 5.00
      }
    ]
  },
  "groupChoices": [
    {
      "groupName": "Toppings",
      "groupNameAr": "الإضافات",
      "maximumChoices": 3,
      "choices": [
        {
          "name": "Extra Cheese",
          "nameAr": "جبن إضافي",
          "price": 2.00
        },
        {
          "name": "Mushrooms",
          "nameAr": "فطر",
          "price": 1.50
        }
      ]
    }
  ]
}
```

**Response**:
```json
{
  "message": "Product created successfully",
  "productId": 101
}
```

**Validation**:
- sectionId: Required
- imageKeys: Required array, at least 1 image
- price: Required, >= 0
- productNameArabic: Required
- productNameEnglish: Required
- categoryIds: Required array, at least 1 category
- variations: Optional
  - variationTitle & variationTitleAr: Required if variations provided
  - options: Required array
  - options[].name & nameAr: Required
  - options[].price: Required, >= 0
- groupChoices: Optional array
  - groupName & groupNameAr: Required
  - maximumChoices: Required, 1-10
  - choices: Required array
  - choices[].name & nameAr: Required
  - choices[].price: Required, >= 0

---

#### 4. Update Product
```http
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters**:
- `id` (number): Product ID

**Request Body**: Same structure as create (all fields optional except those marked required in nested objects)

**Response**:
```json
{
  "message": "Product updated successfully"
}
```

---

#### 5. Delete Product
```http
DELETE /api/products/:id
Authorization: Bearer <token>
```

**Path Parameters**:
- `id` (number): Product ID

**Response**:
```json
{
  "message": "Product deleted successfully"
}
```

**Note**: This is a soft delete; product is marked as deleted but not removed from database.

---

#### 6. Change Product Status
```http
PATCH /api/products/:id/change-status
Authorization: Bearer <token>
```

**Purpose**: Toggles product enabled/disabled status.

**Path Parameters**:
- `id` (number): Product ID

**Response**:
```json
{
  "message": "Product status updated successfully",
  "isEnabled": false
}
```

**Use Case**: Temporarily disable items that are out of stock without deleting them.

---

### Orders Module (`/api/merchant/orders`)

All order endpoints require authentication.

#### 1. List Orders
```http
GET /api/merchant/orders?status=pending&startDate=2025-11-01&endDate=2025-11-30
Authorization: Bearer <token>
```

**Purpose**: Retrieves orders for the merchant with optional filters.

**Query Parameters**:
- `status` (string, optional): Filter by status
  - Values: 'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'
- `startDate` (string, optional): ISO datetime
- `endDate` (string, optional): ISO datetime

**Response**:
```json
[
  {
    "orderId": 5001,
    "orderNumber": "ORD-2025-5001",
    "customerId": 123,
    "customerName": "John Doe",
    "customerPhone": "+11234567890",
    "status": "pending",
    "itemCount": 3,
    "total": 45.97,
    "paymentMethod": "card",
    "paymentStatus": "completed",
    "deliveryAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY"
    },
    "scheduledFor": null,
    "orderDate": "2025-11-23T18:00:00Z"
  }
]
```

---

#### 2. Get Order Details
```http
GET /api/merchant/orders/:orderId
Authorization: Bearer <token>
```

**Path Parameters**:
- `orderId` (number): Order ID

**Response**:
```json
{
  "orderId": 5001,
  "orderNumber": "ORD-2025-5001",
  "customer": {
    "id": 123,
    "name": "John Doe",
    "phone": "+11234567890",
    "email": "john@example.com"
  },
  "items": [
    {
      "productId": 101,
      "productName": "Margherita Pizza",
      "productNameAr": "بيتزا مارغريتا",
      "quantity": 2,
      "unitPrice": 12.99,
      "selectedVariation": "Large",
      "selectedChoices": ["Extra Cheese", "Mushrooms"],
      "subtotal": 31.98,
      "notes": "No olives please"
    }
  ],
  "pricing": {
    "subtotal": 31.98,
    "deliveryFee": 5.00,
    "discount": 0,
    "tax": 2.99,
    "total": 39.97
  },
  "deliveryAddress": {
    "label": "Home",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "deliveryInstructions": "Ring doorbell twice"
  },
  "status": "pending",
  "paymentMethod": "card",
  "paymentStatus": "completed",
  "scheduledFor": null,
  "orderDate": "2025-11-23T18:00:00Z",
  "confirmedAt": null,
  "deliveredAt": null,
  "notes": [
    {
      "id": 1,
      "text": "Customer requested extra napkins",
      "isVisibleToCustomer": true,
      "createdAt": "2025-11-23T18:05:00Z",
      "createdBy": "Manager John"
    }
  ],
  "timeline": [
    {
      "status": "pending",
      "timestamp": "2025-11-23T18:00:00Z"
    }
  ]
}
```

---

#### 3. Update Order Status
```http
PUT /api/merchant/orders/:orderId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

**Path Parameters**:
- `orderId` (number): Order ID

**Valid Status Values**:
- `confirmed` - Order accepted by merchant
- `preparing` - Food is being prepared
- `ready` - Food is ready for pickup/delivery
- `out_for_delivery` - Driver has picked up the order
- `delivered` - Order delivered to customer

**Valid Status Transitions**:
- pending → confirmed
- confirmed → preparing
- preparing → ready
- ready → out_for_delivery
- out_for_delivery → delivered

**Response**:
```json
{
  "message": "Order status updated successfully",
  "status": "confirmed",
  "updatedAt": "2025-11-23T18:10:00Z"
}
```

**Business Rules**:
- Cannot skip status stages
- Cannot revert to previous status
- Automatic notification sent to customer on status change

---

#### 4. Update Shipping Information
```http
PUT /api/merchant/orders/:orderId/shipping
Authorization: Bearer <token>
Content-Type: application/json

{
  "carrier": "FedEx",
  "trackingNumber": "1234567890",
  "estimatedDelivery": "2025-11-23T20:00:00Z"
}
```

**Path Parameters**:
- `orderId` (number): Order ID

**Response**:
```json
{
  "message": "Shipping information updated successfully"
}
```

---

#### 5. Cancel Order
```http
PUT /api/merchant/orders/:orderId/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "out_of_stock",
  "notes": "Main ingredient not available"
}
```

**Path Parameters**:
- `orderId` (number): Order ID

**Valid Reason Values**:
- `out_of_stock` - Item not available
- `unable_to_deliver` - Cannot fulfill delivery
- `customer_request` - Customer requested cancellation
- `other` - Other reason (provide notes)

**Response**:
```json
{
  "message": "Order cancelled successfully",
  "refundStatus": "processing",
  "refundAmount": 39.97
}
```

**Business Rules**:
- Can only cancel orders in 'pending' or 'confirmed' status
- Automatic refund initiated for paid orders
- Customer notification sent

---

#### 6. Create Refund
```http
POST /api/merchant/orders/:orderId/refunds
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 39.97,
  "reason": "quality_issue",
  "notes": "Customer reported cold food"
}
```

**Path Parameters**:
- `orderId` (number): Order ID

**Valid Reason Values**:
- `quality_issue` - Food quality problem
- `wrong_item` - Incorrect item delivered
- `customer_complaint` - Customer not satisfied
- `partial_delivery` - Some items missing
- `other` - Other reason

**Response**:
```json
{
  "message": "Refund created successfully",
  "refundId": 201,
  "amount": 39.97,
  "status": "pending",
  "createdAt": "2025-11-23T19:00:00Z"
}
```

**Business Rules**:
- Refund amount cannot exceed order total
- Multiple partial refunds allowed
- Requires approval for amounts over threshold
- Automatic customer notification

---

#### 7. Add Order Note
```http
POST /api/merchant/orders/:orderId/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "note": "Customer called to change delivery time",
  "isVisibleToCustomer": true
}
```

**Path Parameters**:
- `orderId` (number): Order ID

**Response**:
```json
{
  "message": "Order note added successfully",
  "noteId": 301
}
```

**Use Cases**:
- Internal notes for staff communication (isVisibleToCustomer: false)
- Customer-facing notes for order updates (isVisibleToCustomer: true)
- Delivery instructions from customers
- Special preparation requests

---

## Missing Features Analysis

### Critical Missing Features

#### 1. **Analytics & Reporting** ⚠️ CRITICAL
**Impact**: Merchants cannot track business performance or make data-driven decisions.

**What's Missing**:
- Sales analytics (daily, weekly, monthly, yearly)
- Revenue reports with trends
- Popular products analysis
- Peak hours identification
- Order trends and patterns
- Customer analytics (repeat customers, average order value)
- Profit margins tracking
- Product performance metrics
- Export functionality (CSV, PDF, Excel)

**API Endpoints Needed**:
```
GET /api/analytics/sales?period=daily&startDate&endDate
GET /api/analytics/revenue?period=monthly
GET /api/analytics/popular-products?limit=10&period=weekly
GET /api/analytics/peak-hours?date=2025-11-23
GET /api/analytics/trends?metric=orders&period=monthly
GET /api/analytics/customers?period=monthly
GET /api/analytics/profit-margins
GET /api/analytics/product-performance/:productId
POST /api/analytics/export?format=csv&report=sales&period=monthly
```

---

#### 2. **Inventory Management** ⚠️ CRITICAL
**Impact**: No stock tracking leads to overselling, disappointed customers, and operational chaos.

**What's Missing**:
- Stock quantity tracking per product
- Low stock alerts and notifications
- Auto-disable products when out of stock
- Ingredient tracking and management
- Supplier management
- Purchase orders
- Inventory history and audit trail
- Stock adjustments
- Waste tracking

**API Endpoints Needed**:
```
GET /api/inventory/products
PUT /api/inventory/products/:id/stock
PATCH /api/inventory/products/:id/adjust
GET /api/inventory/alerts
POST /api/inventory/suppliers
GET /api/inventory/suppliers
PUT /api/inventory/suppliers/:id
POST /api/inventory/purchase-orders
GET /api/inventory/purchase-orders
GET /api/inventory/history
POST /api/inventory/waste-log
GET /api/inventory/waste-analytics
```

---

#### 3. **Staff & Role Management** ⚠️ HIGH
**Impact**: Cannot delegate tasks, manage permissions, or track staff activity.

**What's Missing**:
- Multiple staff accounts per merchant
- Role-based permissions (owner, manager, chef, cashier)
- Activity logs and audit trails
- Shift management and scheduling
- Staff performance tracking
- Clock in/out functionality
- Access control per module

**API Endpoints Needed**:
```
POST /api/staff
GET /api/staff
GET /api/staff/:id
PUT /api/staff/:id
DELETE /api/staff/:id
GET /api/staff/roles
PUT /api/staff/:id/role
POST /api/staff/:id/permissions
GET /api/staff/activity-logs?staffId&startDate&endDate
POST /api/staff/shifts
GET /api/staff/shifts?staffId&date
PUT /api/staff/shifts/:id
POST /api/staff/:id/clock-in
POST /api/staff/:id/clock-out
GET /api/staff/:id/performance
```

---

#### 4. **Promotional Tools** ⚠️ HIGH
**Impact**: Cannot create discounts, run marketing campaigns, or attract customers.

**What's Missing**:
- Discount creation (percentage, fixed amount)
- Coupon code generation and management
- Flash sales with time limits
- Bundle offers (buy 2 get 1 free)
- Happy hour pricing
- First-time customer discounts
- Loyalty program setup
- Promotion performance tracking

**API Endpoints Needed**:
```
POST /api/promotions
GET /api/promotions
GET /api/promotions/:id
PUT /api/promotions/:id
DELETE /api/promotions/:id
PATCH /api/promotions/:id/toggle-active
POST /api/promotions/coupons
GET /api/promotions/coupons
PUT /api/promotions/coupons/:id
DELETE /api/promotions/coupons/:id
POST /api/promotions/flash-sales
GET /api/promotions/flash-sales
POST /api/promotions/bundles
GET /api/promotions/:id/performance
GET /api/promotions/analytics
```

---

#### 5. **Customer Relationship Management (CRM)** ⚠️ MEDIUM
**Impact**: Cannot build customer relationships, track loyalty, or communicate effectively.

**What's Missing**:
- Customer list viewing
- Customer order history per merchant
- Customer preferences and favorites
- Customer segmentation
- Loyalty program management
- Customer communication (announcements, offers)
- Feedback and review viewing
- Customer analytics

**API Endpoints Needed**:
```
GET /api/customers?page&limit&sortBy
GET /api/customers/:id
GET /api/customers/:id/orders?page&limit
GET /api/customers/:id/preferences
GET /api/customers/segments
POST /api/customers/segments
POST /api/customers/announcements
POST /api/customers/:id/message
GET /api/customers/feedback?page&limit&rating
GET /api/customers/:id/lifetime-value
GET /api/customers/top-customers?limit=20
GET /api/customers/loyalty-stats
```

---

#### 6. **Menu Template & Bulk Operations** ⚠️ MEDIUM
**Impact**: Tedious menu management for large catalogs; time-consuming updates.

**What's Missing**:
- Bulk product upload (CSV/Excel import)
- Menu templates and presets
- Duplicate product feature
- Bulk price updates
- Bulk status changes (enable/disable multiple products)
- Category-wide operations
- Copy menu from another restaurant
- Export menu to CSV/Excel

**API Endpoints Needed**:
```
POST /api/products/bulk-upload
POST /api/products/import-csv
GET /api/products/export-csv
GET /api/products/templates
POST /api/products/:id/duplicate
PUT /api/products/bulk-update
PATCH /api/products/bulk-status
PUT /api/products/bulk-price-adjustment
PUT /api/categories/:id/bulk-price-update
POST /api/menu/copy-from/:merchantId
```

---

#### 7. **Payment & Financial Management** ⚠️ CRITICAL
**Impact**: No visibility into earnings, payouts, or financial health.

**What's Missing**:
- Earnings dashboard
- Payout history and schedule
- Payment method setup (bank account)
- Bank account linking
- Tax reporting and documents
- Invoice generation for orders
- Financial statements
- Commission tracking
- Transaction history

**API Endpoints Needed**:
```
GET /api/financials/earnings?period=monthly&year=2025
GET /api/financials/payouts?page&limit
GET /api/financials/payout/:id
POST /api/financials/payment-methods
GET /api/financials/payment-methods
PUT /api/financials/payment-methods/:id
DELETE /api/financials/payment-methods/:id
GET /api/financials/tax-reports?year=2025
GET /api/financials/invoices/:orderId
GET /api/financials/statements?year=2025&month=11
GET /api/financials/commissions?period=monthly
GET /api/financials/transactions?page&limit
```

---

#### 8. **Notifications & Alerts** ⚠️ HIGH
**Impact**: Merchants miss important updates, orders, and alerts.

**What's Missing**:
- Push notification preferences
- Email notification settings
- SMS alerts configuration
- Order notifications (new, cancelled, refund requests)
- Low stock alerts
- Review and rating alerts
- Payout notifications
- Notification history

**API Endpoints Needed**:
```
GET /api/notifications?page&limit&isRead
GET /api/notifications/:id
PUT /api/notifications/:id/read
PUT /api/notifications/read-all
DELETE /api/notifications/:id
GET /api/notifications/settings
PUT /api/notifications/settings
POST /api/notifications/test
GET /api/notifications/history?page&limit
```

---

#### 9. **Reviews & Ratings Management** ⚠️ MEDIUM
**Impact**: Cannot respond to customer feedback or improve reputation.

**What's Missing**:
- View product reviews
- View merchant/restaurant reviews
- Respond to reviews
- Flag inappropriate reviews
- Review analytics and sentiment analysis
- Rating trends over time
- Average rating display

**API Endpoints Needed**:
```
GET /api/reviews/products?page&limit&productId
GET /api/reviews/merchant?page&limit&rating
GET /api/reviews/:id
POST /api/reviews/:id/response
PUT /api/reviews/:id/response
POST /api/reviews/:id/flag
GET /api/reviews/analytics?period=monthly
GET /api/reviews/trends
GET /api/reviews/sentiment-analysis
GET /api/reviews/average-rating
```

---

#### 10. **Order Preparation Management** ⚠️ MEDIUM
**Impact**: Inefficient kitchen operations and longer preparation times.

**What's Missing**:
- Kitchen display system (KDS) integration
- Order queue management
- Preparation time estimates
- Multi-station order routing (grill, fryer, prep)
- Timer alerts for orders
- Order prioritization
- Real-time kitchen dashboard

**API Endpoints Needed**:
```
GET /api/kitchen/orders/queue
GET /api/kitchen/orders/:id
PUT /api/kitchen/orders/:id/start-prep
PUT /api/kitchen/orders/:id/complete
PUT /api/kitchen/orders/:id/priority
GET /api/kitchen/stations
POST /api/kitchen/stations
PUT /api/kitchen/orders/:id/route
GET /api/kitchen/timers
GET /api/kitchen/performance?date=2025-11-23
```

---

#### 11. **Table Management** (For Dine-in Restaurants)
**What's Missing**:
- Table layout configuration
- Reservation system
- QR code ordering for tables
- Table status (occupied, available, reserved)
- Waiter assignment
- Floor plan management

**API Endpoints Needed**:
```
GET /api/tables
POST /api/tables
PUT /api/tables/:id
DELETE /api/tables/:id
PUT /api/tables/:id/status
GET /api/reservations
POST /api/reservations
PUT /api/reservations/:id
DELETE /api/reservations/:id
GET /api/tables/:id/orders
POST /api/tables/:id/qr-code
```

---

#### 12. **Delivery Zone Management**
**What's Missing**:
- Define delivery areas/zones
- Set delivery fees by zone
- Minimum order amounts per zone
- Delivery time estimates by zone
- Zone-based product availability
- Zone activation/deactivation

**API Endpoints Needed**:
```
GET /api/delivery-zones
POST /api/delivery-zones
GET /api/delivery-zones/:id
PUT /api/delivery-zones/:id
DELETE /api/delivery-zones/:id
PATCH /api/delivery-zones/:id/toggle-active
```

---

#### 13. **Multi-Branch Support**
**What's Missing**:
- Multiple locations/branches for chains
- Branch-specific menus
- Branch-specific staff
- Cross-branch analytics
- Centralized vs branch inventory
- Transfer inventory between branches

**API Endpoints Needed**:
```
GET /api/branches
POST /api/branches
GET /api/branches/:id
PUT /api/branches/:id
DELETE /api/branches/:id
GET /api/branches/:id/menu
POST /api/branches/:id/menu/copy
GET /api/branches/:id/staff
GET /api/branches/:id/analytics
POST /api/branches/transfer-inventory
```

---

#### 14. **Integration APIs**
**What's Missing**:
- Third-party POS integration
- Accounting software integration (QuickBooks, Xero)
- Delivery service integration
- Payment gateway webhooks
- External menu sync
- Printer integration for kitchen receipts

**API Endpoints Needed**:
```
POST /api/integrations/pos
GET /api/integrations/pos/sync
POST /api/integrations/accounting
GET /api/integrations/accounting/sync
POST /api/integrations/delivery-services
POST /api/webhooks/payment
POST /api/webhooks/delivery-status
GET /api/integrations/list
PUT /api/integrations/:id/settings
```

---

## Proposed New Features

### Innovative Features for Merchant Success

#### 1. **AI-Powered Demand Forecasting** 🤖
Predict order volumes and optimize operations using machine learning.

**Features**:
- Predict busy hours and days
- Ingredient requirement forecasting
- Staff scheduling optimization based on predicted demand
- Dynamic pricing suggestions
- Seasonal trend analysis
- Weather-based demand prediction

**API Endpoints**:
```
GET /api/ai/demand-forecast?date=2025-11-30&period=hourly
GET /api/ai/ingredient-forecast?period=weekly
GET /api/ai/pricing-suggestions?productId=101
GET /api/ai/staff-recommendations?date=2025-11-30
GET /api/ai/trends?period=monthly
GET /api/ai/weather-impact-analysis
```

**Benefits**:
- Reduce food waste by 30-40%
- Optimize inventory levels
- Improve staff scheduling efficiency
- Maximize revenue with dynamic pricing
- Better customer experience with reduced wait times

---

#### 2. **Smart Menu Optimization** 📊
AI recommendations for menu improvements and profitability.

**Features**:
- Low-performing product identification
- Recommended menu items based on market trends
- Optimal pricing analysis
- Seasonal menu suggestions
- Competitor pricing insights
- Menu engineering (star items, dogs, puzzles, plow horses)

**API Endpoints**:
```
GET /api/menu-optimizer/underperforming?threshold=10
GET /api/menu-optimizer/recommendations
GET /api/menu-optimizer/pricing-analysis?productId=101
GET /api/menu-optimizer/seasonal-suggestions
GET /api/menu-optimizer/market-insights?category=pizza
GET /api/menu-optimizer/menu-engineering
```

**Benefits**:
- Increase profitability by 15-25%
- Identify and fix menu issues
- Stay competitive with market trends
- Optimize menu layout and design

---

#### 3. **Automated Marketing Campaigns** 📧
Built-in marketing tools for customer acquisition and retention.

**Features**:
- Automated email campaigns
- SMS marketing with templates
- Push notification campaigns
- Customer segmentation (VIP, at-risk, new)
- A/B testing for promotions
- Campaign performance tracking
- Birthday and anniversary offers
- Win-back campaigns for inactive customers

**API Endpoints**:
```
POST /api/marketing/campaigns
GET /api/marketing/campaigns
GET /api/marketing/campaigns/:id
PUT /api/marketing/campaigns/:id
DELETE /api/marketing/campaigns/:id
POST /api/marketing/campaigns/:id/launch
GET /api/marketing/segments
POST /api/marketing/segments
GET /api/marketing/templates
GET /api/marketing/performance?campaignId=123
POST /api/marketing/ab-tests
GET /api/marketing/ab-tests/:id/results
```

**Benefits**:
- Increase repeat orders by 40%
- Reduce customer churn
- Automated customer engagement
- Data-driven marketing decisions

---

#### 4. **Live Kitchen Dashboard** 🔴
Real-time kitchen operations overview and management.

**Features**:
- Live order queue visualization
- Preparation timers with alerts
- Station workload distribution
- Staff performance metrics
- Average prep time tracking
- Bottleneck identification
- Color-coded order urgency
- One-tap order status updates

**WebSocket Endpoint**:
```
WS /api/kitchen/live
```

**Events**:
```json
{
  "type": "new_order",
  "orderId": 5001,
  "items": [...],
  "priority": "high",
  "estimatedTime": 20
}

{
  "type": "timer_alert",
  "orderId": 5001,
  "station": "grill",
  "elapsed": 15,
  "target": 12
}

{
  "type": "order_completed",
  "orderId": 5001,
  "actualTime": 18
}
```

**Benefits**:
- Reduce order preparation time by 20%
- Better kitchen coordination
- Improved order accuracy
- Real-time performance monitoring

---

#### 5. **Customer Feedback Intelligence** 💬
Advanced review and feedback analysis with AI.

**Features**:
- Sentiment analysis on reviews (positive, negative, neutral)
- Keyword extraction and trending topics
- Automated response suggestions
- Trending complaints identification
- Quality score tracking
- Competitive review comparison
- Issue resolution tracking

**API Endpoints**:
```
GET /api/feedback/sentiment-analysis?period=weekly
GET /api/feedback/keywords?limit=20
GET /api/feedback/suggested-responses/:reviewId
GET /api/feedback/trending-issues
GET /api/feedback/quality-score?period=monthly
GET /api/feedback/competitor-comparison
POST /api/feedback/:reviewId/resolve-issue
```

**Benefits**:
- Improve customer satisfaction by 30%
- Quick issue identification
- Better reputation management
- Data-driven quality improvements

---

#### 6. **Dynamic Pricing Engine** 💰
Optimize prices based on demand, time, and competition.

**Features**:
- Time-based pricing (happy hours, peak hours)
- Demand-based pricing
- Weather-based price adjustments
- Event-based pricing (holidays, sports events)
- Competitor price monitoring
- Revenue optimization algorithms
- Custom pricing rules

**API Endpoints**:
```
POST /api/pricing/rules
GET /api/pricing/rules
GET /api/pricing/rules/:id
PUT /api/pricing/rules/:id
DELETE /api/pricing/rules/:id
GET /api/pricing/optimization-suggestions
GET /api/pricing/competitor-analysis?category=pizza
POST /api/pricing/apply-dynamic
GET /api/pricing/performance?ruleId=123
```

**Benefits**:
- Increase revenue by 10-15%
- Optimize for different time periods
- Stay competitive
- Maximize profit margins

---

#### 7. **Sustainability Tracking** 🌱
Environmental impact monitoring and reporting.

**Features**:
- Carbon footprint calculation per order
- Food waste tracking and reduction tips
- Sustainable packaging usage tracking
- Energy consumption monitoring
- Eco-certification compliance tracking
- Sustainability reports for customers
- Green badges and achievements

**API Endpoints**:
```
GET /api/sustainability/carbon-footprint?period=monthly
POST /api/sustainability/waste-log
GET /api/sustainability/waste-analytics
GET /api/sustainability/packaging-stats
GET /api/sustainability/energy-consumption
GET /api/sustainability/reports?year=2025
GET /api/sustainability/certifications
POST /api/sustainability/goals
GET /api/sustainability/impact-score
```

**Benefits**:
- Appeal to eco-conscious customers
- Reduce waste and costs
- Marketing advantage
- Compliance with regulations

---

#### 8. **Voice-Activated Operations** 🎤
Hands-free merchant operations for busy kitchens.

**Features**:
- Voice order status updates
- Voice product search
- Voice-generated reports
- Kitchen voice commands
- Multi-language support
- Custom voice commands
- Accessibility for visually impaired staff

**API Endpoints**:
```
POST /api/voice/command
POST /api/voice/transcribe
POST /api/voice/search
GET /api/voice/capabilities
POST /api/voice/custom-commands
GET /api/voice/custom-commands
```

**Use Cases**:
- "Update order 5001 to ready"
- "How many orders pending?"
- "Show sales for today"
- "Mark pizza out of stock"

---

#### 9. **Loyalty Program Builder** 🎁
Create and manage custom loyalty programs.

**Features**:
- Points configuration (earn/burn rates)
- Reward tier setup (bronze, silver, gold)
- Stamp card programs
- Referral bonuses
- Birthday rewards
- Exclusive member perks
- Loyalty analytics and ROI

**API Endpoints**:
```
POST /api/loyalty/programs
GET /api/loyalty/programs
PUT /api/loyalty/programs/:id
DELETE /api/loyalty/programs/:id
POST /api/loyalty/tiers
GET /api/loyalty/customers
GET /api/loyalty/analytics
POST /api/loyalty/rewards
GET /api/loyalty/redemptions
```

**Benefits**:
- Increase customer retention by 50%
- Higher average order value
- Word-of-mouth marketing
- Customer data collection

---

#### 10. **Virtual Brand Management** 🏪
Operate multiple virtual brands from one kitchen.

**Features**:
- Create virtual brands with separate identities
- Brand-specific menus
- Separate storefronts for each brand
- Shared inventory across brands
- Brand performance analytics
- Cross-brand promotions
- Different target audiences per brand

**API Endpoints**:
```
POST /api/virtual-brands
GET /api/virtual-brands
GET /api/virtual-brands/:id
PUT /api/virtual-brands/:id
DELETE /api/virtual-brands/:id
GET /api/virtual-brands/:id/menu
POST /api/virtual-brands/:id/menu
GET /api/virtual-brands/:id/analytics
POST /api/virtual-brands/:id/storefront
```

**Use Cases**:
- Pizza brand + Wings brand from same kitchen
- Premium brand + Budget brand
- Breakfast brand + Lunch brand

---

#### 11. **Quality Control Checklist** ✅
Ensure consistent quality and compliance.

**Features**:
- Pre-shift checklists (equipment, cleanliness)
- Food safety compliance checks
- Equipment maintenance tracking
- Quality audit trails
- Photo documentation
- Temperature logging
- Compliance reports
- Issue resolution tracking

**API Endpoints**:
```
GET /api/quality/checklists
POST /api/quality/checks
PUT /api/quality/checks/:id/complete
GET /api/quality/audits?startDate&endDate
POST /api/quality/temperature-logs
GET /api/quality/temperature-logs?equipment=freezer
GET /api/quality/compliance-reports?period=monthly
POST /api/quality/issues
GET /api/quality/issues
```

**Benefits**:
- Ensure food safety
- Pass health inspections
- Consistent quality
- Liability protection

---

#### 12. **Catering Management** 🎉
Handle large orders and events.

**Features**:
- Catering-specific menus
- Bulk order handling
- Event scheduling and calendar
- Custom quotes and proposals
- Delivery coordination
- Catering-specific pricing
- Customer testimonials
- Recurring event bookings

**API Endpoints**:
```
POST /api/catering/menus
GET /api/catering/menus
POST /api/catering/orders
GET /api/catering/orders
POST /api/catering/quotes
GET /api/catering/quotes/:id
PUT /api/catering/quotes/:id/approve
GET /api/catering/calendar?month=11&year=2025
POST /api/catering/events
GET /api/catering/events
```

**Benefits**:
- Tap into high-value market
- Predictable revenue
- Higher profit margins
- Business growth opportunity

---

#### 13. **Smart Waste Management** ♻️
Reduce and track food waste effectively.

**Features**:
- Waste logging by category
- Waste reduction suggestions based on AI
- Surplus food deals (end-of-day discounts)
- Food donation management
- Waste cost analysis
- Sustainability reports
- Trend identification

**API Endpoints**:
```
POST /api/waste/log
GET /api/waste/analytics?period=monthly
GET /api/waste/reduction-tips
POST /api/waste/surplus-deals
GET /api/waste/surplus-deals/active
POST /api/waste/donations
GET /api/waste/donations?startDate&endDate
GET /api/waste/cost-impact
```

**Benefits**:
- Reduce waste by 40%
- Lower food costs
- Environmental impact
- Community goodwill

---

#### 14. **Competitor Analysis** 🔍
Monitor competition and market position.

**Features**:
- Nearby merchant tracking
- Price comparison tools
- Menu analysis and gaps
- Rating monitoring
- Market share insights
- Competitive alerts
- Benchmarking reports

**API Endpoints**:
```
GET /api/competition/nearby?radius=5km
GET /api/competition/price-comparison?category=pizza
GET /api/competition/menu-analysis/:merchantId
GET /api/competition/ratings?period=monthly
GET /api/competition/market-share
POST /api/competition/alerts
GET /api/competition/alerts
GET /api/competition/benchmarks
```

**Benefits**:
- Stay competitive
- Identify opportunities
- Strategic pricing
- Market intelligence

---

#### 15. **Employee Training Platform** 📚
Integrated staff training and development.

**Features**:
- Training modules and courses
- Video tutorials library
- Quizzes and certifications
- Progress tracking per employee
- Onboarding workflows
- Performance evaluations
- Food safety training
- Compliance training

**API Endpoints**:
```
GET /api/training/modules
GET /api/training/modules/:id
POST /api/training/modules
POST /api/training/progress
GET /api/training/staff/:id/progress
POST /api/training/quizzes/:id/submit
GET /api/training/certifications
POST /api/training/certifications
GET /api/training/evaluations
POST /api/training/evaluations
```

**Benefits**:
- Consistent service quality
- Faster onboarding
- Reduced errors
- Employee development

---

## Implementation Roadmap

### Phase 1: Critical Business Functions (Months 1-3)

**Priority: CRITICAL**

1. **Analytics & Reporting**
   - Sales dashboard with charts
   - Revenue reports
   - Popular products analysis
   - Export to CSV/PDF functionality

2. **Inventory Management**
   - Stock tracking per product
   - Low stock alerts
   - Auto-disable out-of-stock items
   - Basic inventory adjustments

3. **Payment & Financials**
   - Earnings dashboard
   - Payout tracking
   - Payment method management
   - Basic financial reports

4. **Notifications System**
   - Order notifications (new, cancelled)
   - Push/email/SMS setup
   - Alert preferences
   - Notification history

**Expected Outcome**: Merchants can track business metrics, manage inventory, and monitor financials effectively.

**Success Metrics**:
- 90% of merchants actively use analytics
- 50% reduction in out-of-stock incidents
- 100% merchant satisfaction with payout visibility

---

### Phase 2: Operational Efficiency (Months 4-6)

**Priority: HIGH**

1. **Staff Management**
   - Multiple staff accounts
   - Role-based permissions
   - Activity logs and audit trails

2. **Promotional Tools**
   - Discount creation
   - Coupon code generation
   - Flash sales
   - Promotion analytics

3. **Reviews Management**
   - View product/merchant reviews
   - Respond to reviews
   - Review analytics
   - Sentiment tracking

4. **Kitchen Operations**
   - Order queue management
   - Preparation tracking
   - Kitchen timers

**Expected Outcome**: Streamlined operations, team collaboration, and customer engagement.

**Success Metrics**:
- 70% of merchants use promotional tools
- 60% review response rate
- 25% improvement in kitchen efficiency

---

### Phase 3: Growth & Marketing (Months 7-9)

**Priority: MEDIUM**

1. **CRM Features**
   - Customer database access
   - Customer segmentation
   - Communication tools

2. **Automated Marketing**
   - Email campaign builder
   - SMS marketing
   - Push notification campaigns

3. **Menu Optimization**
   - Bulk upload/operations
   - Menu templates
   - Performance analysis

4. **Delivery Zone Management**
   - Zone configuration
   - Fee management
   - Zone-based availability

**Expected Outcome**: Customer retention, revenue growth, and market expansion.

**Success Metrics**:
- 40% increase in repeat customer orders
- 30% of merchants run monthly campaigns
- 20% revenue increase from optimized menus

---

### Phase 4: Advanced Intelligence (Months 10-12)

**Priority: NICE TO HAVE**

1. **AI Demand Forecasting**
2. **Dynamic Pricing Engine**
3. **Smart Menu Optimization**
4. **Customer Feedback Intelligence**
5. **Sustainability Tracking**
6. **Voice Operations**
7. **Virtual Brand Management**
8. **Competitor Analysis**
9. **Employee Training Platform**
10. **Quality Control System**

**Expected Outcome**: Industry-leading intelligent platform with competitive advantages.

**Success Metrics**:
- 30% reduction in food waste
- 15% revenue increase from dynamic pricing
- 50% improvement in customer satisfaction
- Market leader in innovation

---

## Best Practices

### API Design Standards

**1. Consistent Response Format**
```json
{
  "success": true,
  "data": {
    // actual response data
  },
  "meta": {
    "timestamp": "2025-11-23T18:00:00Z",
    "requestId": "req_abc123"
  }
}
```

**2. Error Handling**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Product is out of stock",
    "field": "productId",
    "statusCode": 400,
    "details": {
      "productId": 101,
      "currentStock": 0,
      "requestedQuantity": 5
    }
  },
  "meta": {
    "timestamp": "2025-11-23T18:00:00Z",
    "requestId": "req_abc123"
  }
}
```

**3. Pagination**
```
GET /api/products?page=1&limit=20

Response:
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### Security Best Practices

**1. Token Management**
- Rotate access tokens regularly (24-hour expiry)
- Implement refresh token rotation
- Blacklist revoked tokens in Redis
- Monitor for suspicious activity patterns
- Implement JWT token versioning

**2. Data Validation**
- Validate all inputs using DTOs
- Sanitize user data to prevent XSS
- Use class-validator decorators
- Implement rate limiting (100 req/min per merchant)
- SQL injection prevention via stored procedures

**3. Authorization**
- Always verify merchantId matches requester
- Implement role-based access control (RBAC)
- Audit trail for sensitive operations
- Principle of least privilege
- Verify resource ownership before operations

**4. Sensitive Data Protection**
- Never log passwords or tokens
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Secure S3 bucket access
- Regular security audits

---

### Performance Optimization

**1. Database Queries**
- Index frequently queried fields:
  - `merchant_id` on all merchant-scoped tables
  - `created_at` for time-based queries
  - `status` for order filtering
- Optimize stored procedures
- Implement Redis caching for:
  - Category lists
  - Merchant info
  - Product lists (5-minute TTL)
- Use connection pooling (max 20 connections)

**2. Image Handling**
- Use S3 presigned URLs (1-hour expiry)
- Implement image compression before upload
- Lazy load images on frontend
- CDN for static assets (CloudFront)
- WebP format for better compression

**3. Real-time Features**
- WebSocket for live kitchen dashboard
- Server-Sent Events (SSE) for notifications
- Efficient event broadcasting via Redis Pub/Sub
- Connection management and cleanup

**4. API Response Times**
- Target: < 200ms for GET requests
- Target: < 500ms for POST/PUT requests
- Implement response compression (gzip)
- Minimize database round trips
- Use database views for complex queries

---

### Testing Strategy

**Unit Tests**:
```typescript
describe('ProductsService', () => {
  let service: ProductsService;
  let repository: ProductsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: {
            createProduct: jest.fn(),
            findAllProducts: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<ProductsRepository>(ProductsRepository);
  });

  it('should create product with variations', async () => {
    const merchantId = 456;
    const dto: CreateProductDto = {
      sectionId: 1,
      productNameEnglish: 'Pizza',
      productNameArabic: 'بيتزا',
      price: 12.99,
      imageKeys: ['img1.jpg'],
      categoryIds: [10],
      variations: {
        variationTitle: 'Size',
        variationTitleAr: 'الحجم',
        options: [
          { name: 'Small', nameAr: 'صغير', price: 0 },
          { name: 'Large', nameAr: 'كبير', price: 5 }
        ]
      }
    };

    jest.spyOn(repository, 'createProduct').mockResolvedValue({ productId: 101 });

    const result = await service.createProduct(merchantId, dto);

    expect(result.productId).toBe(101);
    expect(repository.createProduct).toHaveBeenCalledWith(merchantId, dto);
  });

  it('should validate price is non-negative', async () => {
    const dto: CreateProductDto = {
      // ... other fields
      price: -5
    };

    await expect(service.createProduct(456, dto)).rejects.toThrow();
  });
});
```

**Integration Tests**:
```typescript
describe('Orders API (Integration)', () => {
  let app: INestApplication;
  let authToken: string;
  let merchantId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Authenticate merchant
    const authResponse = await request(app.getHttpServer())
      .post('/api/auth/password')
      .send({
        countryCode: '+1',
        phoneNumber: '1234567890',
        password: 'TestPass123!'
      });

    authToken = authResponse.body.accessToken;
    merchantId = authResponse.body.user.merchantId;
  });

  it('should update order status to confirmed', async () => {
    const response = await request(app.getHttpServer())
      .put('/api/merchant/orders/5001/status')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'confirmed' })
      .expect(200);

    expect(response.body.message).toContain('updated successfully');
    expect(response.body.status).toBe('confirmed');
  });

  it('should reject invalid status transitions', async () => {
    await request(app.getHttpServer())
      .put('/api/merchant/orders/5001/status')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'delivered' }) // Skip from confirmed to delivered
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
```

**E2E Tests**:
```typescript
describe('Merchant Onboarding Flow (E2E)', () => {
  it('should complete full merchant onboarding', async () => {
    // 1. Send OTP
    await request(app.getHttpServer())
      .post('/api/auth/send-otp')
      .send({ countryCode: '+1', phoneNumber: '9876543210' })
      .expect(200);

    // 2. Verify OTP
    const verifyResponse = await request(app.getHttpServer())
      .post('/api/auth/verify-otp')
      .send({ countryCode: '+1', phoneNumber: '9876543210', code: '123456' })
      .expect(200);

    const { verifyToken } = verifyResponse.body;

    // 3. Register with password
    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/password')
      .send({
        verifyToken,
        password: 'SecurePass123!',
        firstName: 'Test',
        lastName: 'Merchant'
      })
      .expect(200);

    const { accessToken } = registerResponse.body;

    // 4. Create merchant info
    await request(app.getHttpServer())
      .post('/api/merchants/info')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test Restaurant',
        description: 'Test Description',
        coverKey: 'test/cover.jpg',
        imageKey: 'test/logo.jpg',
        categoryId: 10,
        hotline: '+11234567890'
      })
      .expect(201);

    // 5. Create schedule
    await request(app.getHttpServer())
      .post('/api/merchants/schedules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        weeklySchedule: [
          // ... 7 days
        ]
      })
      .expect(201);

    // 6. Add contact person
    await request(app.getHttpServer())
      .post('/api/merchants/contact-person')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Manager',
        phone: '+11234567890',
        email: 'john@test.com',
        position: 'Manager'
      })
      .expect(201);

    // 7. Add location
    await request(app.getHttpServer())
      .post('/api/merchants/location')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        latitude: 40.7128,
        longitude: -74.0060
      })
      .expect(201);

    // 8. Request approval
    await request(app.getHttpServer())
      .post('/api/merchants/request-approval')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ notes: 'Ready for review' })
      .expect(201);
  });
});
```

---

## Deployment Guide

### Environment Variables

**Development:**
```env
NODE_ENV=development
PORT=3001
LOG_LEVEL=debug

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=namnam_dev
DB_USER=postgres
DB_PASSWORD=dev_password

# JWT
JWT_SECRET=dev_secret_key_change_in_production
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=30d

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=dev_access_key
AWS_SECRET_ACCESS_KEY=dev_secret_key
S3_BUCKET=namnam-merchant-dev

# OTP (Development uses hardcoded)
OTP_HARDCODED=true
OTP_CODE=123456
```

**Production:**
```env
NODE_ENV=production
PORT=3001
LOG_LEVEL=error

# Database
DB_HOST=prod-db.example.com
DB_PORT=5432
DB_NAME=namnam_prod
DB_USER=namnam_merchant_user
DB_PASSWORD=<strong_password>
DB_SSL=true
DB_POOL_SIZE=20

# JWT
JWT_SECRET=<strong_random_secret_512_bits>
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=30d

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<prod_access_key>
AWS_SECRET_ACCESS_KEY=<prod_secret_key>
S3_BUCKET=namnam-merchant-prod
S3_PRESIGN_EXPIRES=3600

# OTP (Production)
OTP_HARDCODED=false
OTP_PROVIDER=twilio
TWILIO_ACCOUNT_SID=<your_sid>
TWILIO_AUTH_TOKEN=<your_token>
TWILIO_PHONE_NUMBER=+1234567890

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=namnam-platform
FIREBASE_PRIVATE_KEY=<your_private_key>
FIREBASE_CLIENT_EMAIL=firebase@namnam.iam.gserviceaccount.com

# Redis (Caching & Sessions)
REDIS_HOST=redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=<redis_password>

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000
```

---

### Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/merchant_api ./apps/merchant_api
COPY libs ./libs

# Build application
RUN npm run build:merchant

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist/apps/merchant_api ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S merchantapi -u 1001

# Change ownership
RUN chown -R merchantapi:nodejs /app

# Switch to non-root user
USER merchantapi

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/main"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  merchant-api:
    build:
      context: .
      dockerfile: apps/merchant_api/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PORT=5432
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - namnam-network
    volumes:
      - ./logs:/app/logs

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: namnam
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./database/migrations:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - namnam-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - namnam-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - merchant-api
    networks:
      - namnam-network
    restart: unless-stopped

volumes:
  postgres-data:
  redis-data:

networks:
  namnam-network:
    driver: bridge
```

---

### Monitoring & Logging

**Health Check Endpoint:**
```typescript
// health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { PostgresService } from '@app/database/postgres.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly postgresService: PostgresService,
  ) {}

  @Get()
  async check() {
    const dbHealthy = await this.checkDatabase();
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    return {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      database: dbHealthy ? 'connected' : 'disconnected',
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
      },
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.postgresService.query('SELECT 1');
      return true;
    } catch (error) {
      return false;
    }
  }
}
```

**Structured Logging:**
```typescript
import { Logger } from '@nestjs/common';

export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  async createProduct(merchantId: number, dto: CreateProductDto) {
    this.logger.log({
      action: 'create_product',
      merchantId,
      productName: dto.productNameEnglish,
      price: dto.price,
    });

    try {
      const product = await this.repository.createProduct(merchantId, dto);

      this.logger.log({
        action: 'create_product_success',
        merchantId,
        productId: product.id,
      });

      return product;
    } catch (error) {
      this.logger.error({
        action: 'create_product_error',
        merchantId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
```

---

## Support & Contribution

### Reporting Issues
Create issues with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node version, OS, etc.)
- Screenshots or error logs

### Contributing
1. Fork the repository
2. Create a feature branch (`feature/analytics-dashboard`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request with clear description

### Code Review Guidelines
- Code must pass all tests
- Follow existing code style
- Update documentation
- Add meaningful commit messages
- Respond to reviewer feedback

---

## Appendix

### HTTP Status Codes Reference
| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input, validation errors |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource conflict (duplicate) |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily down |

---

### Database Stored Procedures Reference

**Auth Module:**
- `insert_user_otp` - Store OTP for verification
- `verify_user_otp` - Validate OTP code
- `insert_merchant` - Register new merchant
- `select_merchant` - Get merchant by phone
- `update_fcm_token_merchant` - Update FCM token for push notifications
- `update_merchant_locale` - Set language preference (en/ar)

**Merchant Module:**
- `select_merchant_info` - Get merchant profile information
- `create_restaurant_merchant` - Create restaurant profile
- `create_merchant_contact_person` - Add contact person
- `insert_weekly_schedule` - Store operating hours
- `select_schedule_info_by_merchant_id` - Retrieve schedule
- `create_location_merchant` - Store location information
- `select_location_info_by_merchant_id` - Get location details
- `insert_merchant_request` - Submit approval request

**Catalog Module:**
- `insert_catalog_section` - Create menu section
- `select_catalog_sections` - List all sections
- `update_merchant_section` - Update section details

**Products Module:**
- `insert_merchant_product` - Create new product
- `select_merchant_products` - List products (with optional section filter)
- `select_merchant_product_by_id` - Get product details
- `update_merchant_product` - Update product
- `delete_product_merchant` - Soft delete product
- `update_product_disabled_status` - Toggle product enabled/disabled

**Orders Module:**
- `select_merchant_orders` - List orders with filters
- `select_merchant_order_details` - Get detailed order information
- `update_order_status_merchant` - Update order status
- `update_order_shipping_merchant` - Update shipping information
- `cancel_order_merchant` - Cancel order with reason
- `create_order_refund_merchant` - Create refund
- `add_order_note_merchant` - Add internal or customer-facing note

---

### Rate Limiting Recommendations
- Authentication endpoints: 10 requests/minute
- Read operations: 100 requests/minute
- Write operations: 30 requests/minute
- File uploads: 10 requests/minute
- Analytics/reports: 20 requests/minute

---

### API Versioning Strategy

When breaking changes are needed:
1. Create new version (`/api/v2/`)
2. Maintain old version for 6-12 months
3. Communicate deprecation timeline to merchants
4. Provide migration guide and tools
5. Send deprecation warnings in API responses

---

**API Version:** 1.0.0
**Last Updated:** November 23, 2025
**Maintained By:** NamNam Platform Development Team
**Next Review:** December 23, 2025
**License:** Proprietary

---

## Quick Reference

### Common Operations

**Create a Product:**
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "sectionId": 1,
    "imageKeys": ["products/pizza.jpg"],
    "price": 12.99,
    "productNameEnglish": "Margherita Pizza",
    "productNameArabic": "بيتزا مارغريتا",
    "categoryIds": [10]
  }'
```

**Update Order Status:**
```bash
curl -X PUT http://localhost:3001/api/merchant/orders/5001/status \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'
```

**Get Analytics:**
```bash
# Coming soon in Phase 1
curl -X GET "http://localhost:3001/api/analytics/sales?period=daily" \
  -H "Authorization: Bearer ${TOKEN}"
```

---

## Support Contacts

- **Technical Support**: support@namnam.com
- **API Issues**: api-support@namnam.com
- **Business Inquiries**: business@namnam.com
- **Documentation**: docs@namnam.com

---

**End of Documentation**
