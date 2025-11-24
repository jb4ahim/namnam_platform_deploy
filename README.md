# NamNam Platform Documentation

## Overview

NamNam is a comprehensive food delivery platform built with modern microservices architecture. The platform consists of three specialized APIs that work together to provide a complete food ordering ecosystem:

- **Customer API** (Port 3002): Customer-facing application for browsing restaurants, placing orders, and tracking deliveries
- **Merchant API** (Port 3001): Restaurant/merchant operations for managing menus, orders, and business settings
- **Management API** (Port 3003): Platform administration for managing merchants, promotions, zones, and app configuration

## Quick Links

- [Customer API Documentation](apps/customer_api/CUSTOMER_API_DOCUMENTATION.md) - 40+ endpoints for customer operations
- [Merchant API Documentation](apps/merchant_api/MERCHANT_API_DOCUMENTATION.md) - 27+ endpoints for merchant operations
- [Management API Documentation](apps/management_api/MANAGEMENT_API_DOCUMENTATION.md) - 35+ endpoints for platform administration
- [App Config Module Guide](apps/management_api/src/modules/app-config/README.md) - Dynamic home page configuration

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         NamNam Platform                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Customer API   │  │  Merchant API   │  │ Management API  │ │
│  │   Port 3002     │  │   Port 3001     │  │   Port 3003     │ │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘ │
│           │                    │                     │          │
│           └────────────────────┼─────────────────────┘          │
│                                │                                │
│                    ┌───────────▼───────────┐                   │
│                    │   PostgreSQL Database  │                   │
│                    │   (Stored Procedures)  │                   │
│                    └───────────────────────┘                   │
│                                                                  │
│                    ┌───────────────────────┐                   │
│                    │      AWS S3 Storage    │                   │
│                    │  (Images & Media)      │                   │
│                    └───────────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

### API Interaction Flow

```
Customer → Places Order → Customer API
                           ↓
                    Creates Order Record
                           ↓
                    PostgreSQL Database
                           ↓
Merchant ← Receives Order ← Merchant API
                           ↓
                    Updates Order Status
                           ↓
Admin ← Monitors Platform ← Management API
```

### Technology Stack

**Backend Framework:**
- NestJS 10.x (TypeScript)
- Fastify Adapter (High-performance HTTP server)
- Node.js

**Database:**
- PostgreSQL 14+
- Stored Procedures Pattern
- JSONB for flexible data structures

**Authentication:**
- JWT (Access + Refresh Tokens)
- Bcrypt Password Hashing
- Phone-based OTP Authentication

**Storage:**
- AWS S3 for images and media
- Presigned URLs for secure access

**Validation:**
- class-validator
- class-transformer
- Custom DTOs per module

**Development Tools:**
- TypeScript 5.x
- ESLint
- Prettier
- Jest (Testing)

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- AWS Account (for S3 storage)
- Git

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-org/namnam_platform.git
cd namnam_platform
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create `.env` files for each API:

**Customer API** (`apps/customer_api/.env`):
```env
PORT=3002
DATABASE_URL=postgresql://user:password@localhost:5432/namnam
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=namnam-customer-uploads
AWS_REGION=us-east-1
```

**Merchant API** (`apps/merchant_api/.env`):
```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/namnam
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=namnam-merchant-uploads
AWS_REGION=us-east-1
```

**Management API** (`apps/management_api/.env`):
```env
PORT=3003
DATABASE_URL=postgresql://user:password@localhost:5432/namnam
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=namnam-management-uploads
AWS_REGION=us-east-1
```

4. **Set up the database:**

Run the database migration scripts (if available) or manually create the database schema and stored procedures.

```bash
# Create database
createdb namnam

# Run migrations (adjust path as needed)
psql -d namnam -f database/schema.sql
psql -d namnam -f database/procedures.sql
```

5. **Run the applications:**

```bash
# Run Customer API
npm run start:customer

# Run Merchant API
npm run start:merchant

# Run Management API
npm run start:management
```

Or run all APIs concurrently:
```bash
npm run start:all
```

---

## Project Structure

```
namnam_platform/
├── apps/
│   ├── customer_api/              # Customer-facing API
│   │   ├── src/
│   │   │   ├── modules/           # Feature modules
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   ├── merchants/
│   │   │   │   ├── products/
│   │   │   │   ├── orders/
│   │   │   │   ├── cart/
│   │   │   │   ├── favorites/
│   │   │   │   ├── reviews/
│   │   │   │   └── ...
│   │   │   ├── main.ts
│   │   │   └── app.module.ts
│   │   └── CUSTOMER_API_DOCUMENTATION.md
│   │
│   ├── merchant_api/              # Merchant operations API
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── merchant/
│   │   │   │   ├── products/
│   │   │   │   ├── catalog/
│   │   │   │   ├── orders/
│   │   │   │   └── ...
│   │   │   ├── main.ts
│   │   │   └── app.module.ts
│   │   └── MERCHANT_API_DOCUMENTATION.md
│   │
│   └── management_api/            # Platform administration API
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── users/
│       │   │   ├── merchants/
│       │   │   ├── categories/
│       │   │   ├── zones/
│       │   │   ├── promotions/
│       │   │   ├── coupons/
│       │   │   ├── app-config/
│       │   │   └── ...
│       │   ├── main.ts
│       │   └── app.module.ts
│       └── MANAGEMENT_API_DOCUMENTATION.md
│
├── libs/                          # Shared libraries
│   ├── auth/                      # Shared auth utilities
│   ├── database/                  # Database utilities
│   ├── storage/                   # AWS S3 utilities
│   └── common/                    # Common utilities
│
├── database/                      # Database scripts
│   ├── schema.sql
│   ├── procedures.sql
│   └── migrations/
│
├── docker/                        # Docker configuration
│   └── docker-compose.yml
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## Shared Libraries

The platform uses shared libraries (`@app/*` modules) to maintain consistency across all three APIs:

### `@app/database`

Database utilities for PostgreSQL interaction using stored procedures.

**Key Features:**
- `DatabaseUtils` class for executing stored procedures
- Connection pooling
- Query result transformation
- Error handling

**Usage Example:**
```typescript
import { DatabaseUtils } from '@app/database';

@Injectable()
export class UsersRepository {
  constructor(private dbUtils: DatabaseUtils) {}

  async findUserById(userId: number): Promise<User> {
    return this.dbUtils.callProcedure('select_user_by_id', [userId]);
  }
}
```

### `@app/auth`

Authentication utilities for JWT token management.

**Key Features:**
- JWT token generation and validation
- Token refresh mechanism
- Password hashing with Bcrypt
- Auth guards and decorators

**Usage Example:**
```typescript
import { JwtAuthGuard, CurrentUser } from '@app/auth';

@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@CurrentUser() user: any) {
  return user;
}
```

### `@app/storage`

AWS S3 integration for file uploads and management.

**Key Features:**
- Presigned URL generation for uploads
- Presigned URL generation for downloads
- File deletion
- S3 client configuration

**Usage Example:**
```typescript
import { StorageService } from '@app/storage';

@Injectable()
export class MerchantsService {
  constructor(private storageService: StorageService) {}

  async getUploadUrl(fileName: string): Promise<string> {
    return this.storageService.getPresignedUploadUrl(fileName);
  }
}
```

### `@app/common`

Common utilities, DTOs, and interfaces shared across APIs.

**Key Features:**
- Response envelope interceptor
- Global exception filters
- Common DTOs (pagination, response formats)
- Validation pipes
- Helper functions

---

## Database Architecture

### Stored Procedures Pattern

All database operations use PostgreSQL stored procedures for:
- **Performance**: Reduced network overhead
- **Security**: SQL injection prevention
- **Maintainability**: Business logic in database layer
- **Consistency**: Single source of truth for data operations

### Common Stored Procedures

**Authentication:**
- `select_user_by_phone(phone_number VARCHAR)` - Get user by phone
- `insert_user(phone_number VARCHAR, password_hash VARCHAR)` - Create user
- `update_user_password(user_id INT, password_hash VARCHAR)` - Update password

**Merchants:**
- `select_merchants(filters JSONB, sorts JSONB, p_limit INT, p_offset INT)` - List merchants
- `select_merchant_by_id(merchant_id INT)` - Get merchant details
- `update_merchant_status(merchant_id INT, status VARCHAR)` - Update merchant status

**Products:**
- `select_products_by_merchant(merchant_id INT, filters JSONB)` - Get merchant products
- `insert_product(merchant_id INT, data JSONB)` - Create product
- `update_product(product_id INT, data JSONB)` - Update product

**Orders:**
- `insert_order(customer_id INT, merchant_id INT, items JSONB, delivery_info JSONB)` - Create order
- `update_order_status(order_id INT, status VARCHAR)` - Update order status
- `select_orders_by_customer(customer_id INT, filters JSONB)` - Get customer orders

### JSONB Usage

The platform extensively uses PostgreSQL's JSONB type for flexible data structures:

**App Configuration:**
```sql
CREATE TABLE app_config (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,  -- Flexible configuration structure
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Product Variations:**
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  merchant_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  variations JSONB,  -- Array of variation groups
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Communication Patterns

### Customer Journey

1. **Browse Restaurants:**
   - Customer API: `GET /api/merchants` → Returns merchant list
   - Filters: location, cuisine, rating, delivery time
   - Data source: `select_merchants()` stored procedure

2. **View Menu:**
   - Customer API: `GET /api/products/merchant/:id` → Returns products
   - Includes variations, addons, availability
   - Data source: `select_products_by_merchant()` stored procedure

3. **Place Order:**
   - Customer API: `POST /api/orders` → Creates order
   - Validates cart, calculates totals
   - Data source: `insert_order()` stored procedure
   - Triggers notification to merchant

4. **Track Order:**
   - Customer API: `GET /api/orders/:id` → Returns order status
   - Real-time updates via polling or websockets
   - Data source: `select_order_by_id()` stored procedure

### Merchant Journey

1. **Receive Order Notification:**
   - Merchant API: `GET /api/orders` → Lists new orders
   - Filtered by merchant_id from JWT token
   - Data source: `select_orders_by_merchant()` stored procedure

2. **Accept Order:**
   - Merchant API: `PUT /api/orders/:id/accept` → Updates status to "accepted"
   - Data source: `update_order_status()` stored procedure
   - Triggers notification to customer

3. **Prepare & Complete:**
   - Merchant API: `PUT /api/orders/:id/ready` → Marks order ready
   - Merchant API: `PUT /api/orders/:id/complete` → Completes order
   - Each status change triggers customer notifications

4. **Manage Menu:**
   - Merchant API: `POST /api/products` → Creates new products
   - Merchant API: `PUT /api/products/:id` → Updates products
   - Merchant API: `PUT /api/catalog/availability/:id` → Toggle availability
   - Bilingual support (Arabic & English)

### Admin Journey

1. **Merchant Approval:**
   - Management API: `GET /api/merchants?status=pending` → Lists pending merchants
   - Management API: `PUT /api/merchants/:id/approve` → Approves merchant
   - Data source: `update_merchant_status()` stored procedure

2. **Configure Home Page:**
   - Management API: `POST /api/app-config/home` → Updates home configuration
   - Supports manual IDs, filters, and hybrid approaches
   - See: [App Config Documentation](apps/management_api/src/modules/app-config/README.md)

3. **Create Promotions:**
   - Management API: `POST /api/promotions` → Creates promotion
   - Bilingual support with action types (navigate, external link, deeplink)
   - Data source: `insert_promotion()` stored procedure

4. **Manage Geographic Zones:**
   - Management API: `POST /api/zones` → Creates delivery zone
   - Polygon-based geographic boundaries
   - Data source: `insert_zone()` stored procedure

---

## Authentication & Authorization

### Authentication Flow

All three APIs use the same authentication pattern:

```
1. Send OTP:
   POST /api/auth/send-otp
   Body: { "phone": "+1234567890" }
   Response: { "message": "OTP sent" }

2. Verify OTP:
   POST /api/auth/verify-otp
   Body: { "phone": "+1234567890", "otp": "123456" }
   Response: { "verifyToken": "..." }

3. Set Password (first time) OR Login:
   POST /api/auth/password
   Body: { "verifyToken": "...", "password": "..." }
   Response: {
     "accessToken": "...",
     "refreshToken": "...",
     "user": {...}
   }

4. Refresh Token:
   POST /api/auth/refresh
   Body: { "refreshToken": "..." }
   Response: { "accessToken": "..." }
```

### Authorization Levels

**Customer API:**
- Public endpoints: Browse merchants, view products, view promotions
- Authenticated endpoints: Place orders, manage profile, add favorites, write reviews

**Merchant API:**
- All endpoints require authentication
- Merchant can only access their own data (enforced via JWT merchant_id)

**Management API:**
- All endpoints require authentication
- Admin users have full access to all operations

### JWT Token Structure

**Access Token (expires in 15 minutes):**
```json
{
  "userId": 123,
  "role": "customer|merchant|admin",
  "merchantId": 45,  // Only for merchant tokens
  "iat": 1234567890,
  "exp": 1234568790
}
```

**Refresh Token (expires in 7 days):**
```json
{
  "userId": 123,
  "type": "refresh",
  "iat": 1234567890,
  "exp": 1235172690
}
```

---

## Deployment Guide

### Docker Deployment

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: namnam
      POSTGRES_USER: namnam_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"

  customer-api:
    build:
      context: .
      dockerfile: ./apps/customer_api/Dockerfile
    ports:
      - "3002:3002"
    environment:
      - PORT=3002
      - DATABASE_URL=postgresql://namnam_user:secure_password@postgres:5432/namnam
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_S3_BUCKET=namnam-customer-uploads
      - AWS_REGION=us-east-1
    depends_on:
      - postgres

  merchant-api:
    build:
      context: .
      dockerfile: ./apps/merchant_api/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
      - DATABASE_URL=postgresql://namnam_user:secure_password@postgres:5432/namnam
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_S3_BUCKET=namnam-merchant-uploads
      - AWS_REGION=us-east-1
    depends_on:
      - postgres

  management-api:
    build:
      context: .
      dockerfile: ./apps/management_api/Dockerfile
    ports:
      - "3003:3003"
    environment:
      - PORT=3003
      - DATABASE_URL=postgresql://namnam_user:secure_password@postgres:5432/namnam
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_S3_BUCKET=namnam-management-uploads
      - AWS_REGION=us-east-1
    depends_on:
      - postgres

volumes:
  postgres_data:
```

**Deploy:**
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment Checklist

**Environment:**
- [ ] Set strong JWT secrets (different for each environment)
- [ ] Configure production database credentials
- [ ] Set up AWS S3 buckets with proper IAM permissions
- [ ] Configure CORS allowed origins for production domains
- [ ] Enable SSL/TLS certificates

**Database:**
- [ ] Run database migrations
- [ ] Create database backups schedule
- [ ] Set up connection pooling
- [ ] Configure database monitoring

**Security:**
- [ ] Enable rate limiting
- [ ] Configure helmet.js security headers
- [ ] Set up API request logging
- [ ] Implement API key rotation
- [ ] Enable CSRF protection where applicable

**Monitoring:**
- [ ] Set up application performance monitoring (APM)
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up log aggregation
- [ ] Configure health check endpoints
- [ ] Set up uptime monitoring

**Scalability:**
- [ ] Configure load balancer
- [ ] Set up horizontal scaling (multiple instances)
- [ ] Configure Redis for session management (if needed)
- [ ] Set up CDN for static assets
- [ ] Optimize database queries and indexes

---

## Development Workflow

### Running Locally

**Development Mode (with hot reload):**
```bash
# Customer API
npm run start:dev:customer

# Merchant API
npm run start:dev:merchant

# Management API
npm run start:dev:management
```

**Production Build:**
```bash
# Build all APIs
npm run build

# Start production builds
npm run start:prod:customer
npm run start:prod:merchant
npm run start:prod:management
```

### Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Database Development

**Creating New Stored Procedures:**

1. Write procedure in SQL file:
```sql
CREATE OR REPLACE FUNCTION insert_user(
  p_phone VARCHAR,
  p_password_hash VARCHAR
)
RETURNS TABLE(id INT, phone VARCHAR, created_at TIMESTAMP) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO users (phone, password_hash)
  VALUES (p_phone, p_password_hash)
  RETURNING users.id, users.phone, users.created_at;
END;
$$ LANGUAGE plpgsql;
```

2. Apply to database:
```bash
psql -d namnam -f database/procedures/insert_user.sql
```

3. Use in repository:
```typescript
async createUser(phone: string, passwordHash: string): Promise<User> {
  return this.dbUtils.callProcedure('insert_user', [phone, passwordHash]);
}
```

---

## API Response Format

All APIs use a consistent response envelope format:

**Success Response:**
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operation completed successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error details
    }
  }
}
```

**Paginated Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  }
}
```

---

## Environment Variables Reference

### Customer API

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | API server port | `3002` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/namnam` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `JWT_REFRESH_SECRET` | Refresh token secret | `your-refresh-secret` |
| `AWS_ACCESS_KEY_ID` | AWS access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | `secret...` |
| `AWS_S3_BUCKET` | S3 bucket name | `namnam-customer-uploads` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` |

### Merchant API

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | API server port | `3001` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/namnam` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `JWT_REFRESH_SECRET` | Refresh token secret | `your-refresh-secret` |
| `AWS_ACCESS_KEY_ID` | AWS access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | `secret...` |
| `AWS_S3_BUCKET` | S3 bucket name | `namnam-merchant-uploads` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` |

### Management API

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | API server port | `3003` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/namnam` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `JWT_REFRESH_SECRET` | Refresh token secret | `your-refresh-secret` |
| `AWS_ACCESS_KEY_ID` | AWS access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | `secret...` |
| `AWS_S3_BUCKET` | S3 bucket name | `namnam-management-uploads` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` |

---

## Key Features

### Customer API Features
- Phone-based OTP authentication
- Restaurant browsing with filters (location, cuisine, rating, delivery time)
- Product catalog with variations and addons
- Shopping cart management
- Order placement and tracking
- Address management with geolocation
- Favorites and bookmarks
- Reviews and ratings
- Notifications
- Search functionality
- Promotion browsing

### Merchant API Features
- Merchant authentication and profile management
- Bilingual menu management (Arabic & English)
- Product variations and group choices
- Weekly schedule configuration
- Order management and fulfillment
- Order status updates (accept, prepare, ready, complete)
- Catalog management (categories, availability toggles)
- Refund and cancellation handling
- Business information management

### Management API Features
- Admin authentication
- Merchant approval workflow
- User management (customers and merchants)
- Category management with translations
- Geographic zone management (polygon-based)
- Promotion management with bilingual support
- Flexible coupon system with rules and limits
- Dynamic home page configuration
  - Manual item selection
  - Filter-based data sources
  - Hybrid approach
  - Multiple component types (carousel, grid, list, feed)

---

## Best Practices

### Code Organization
- Follow NestJS module structure (controller → service → repository)
- Keep controllers thin - delegate business logic to services
- Use DTOs for all request/response validation
- Implement proper error handling with custom exceptions
- Use TypeScript strict mode

### Database Access
- Always use stored procedures for database operations
- Never write raw SQL in application code
- Use JSONB for flexible data structures
- Implement proper indexing for performance
- Use transactions for multi-step operations

### Security
- Validate all user inputs using DTOs
- Use parameterized queries (via stored procedures)
- Implement rate limiting on authentication endpoints
- Hash passwords with Bcrypt (min 10 rounds)
- Use short-lived access tokens (15 minutes)
- Implement refresh token rotation
- Sanitize error messages (don't expose internal details)

### Performance
- Implement caching where appropriate (Redis recommended)
- Use pagination for list endpoints
- Optimize database queries and use indexes
- Use presigned URLs for file uploads/downloads
- Implement connection pooling
- Monitor query performance

### API Design
- Follow RESTful conventions
- Use proper HTTP status codes
- Implement consistent response envelopes
- Version your APIs (/api/v1/)
- Document all endpoints
- Provide clear error messages

---

## Troubleshooting

### Common Issues

**Database Connection Error:**
```
Error: Connection terminated unexpectedly
```
**Solution:** Check DATABASE_URL, ensure PostgreSQL is running, verify credentials

**JWT Token Error:**
```
Error: jwt malformed
```
**Solution:** Verify JWT_SECRET is set correctly, check token format

**AWS S3 Error:**
```
Error: Access Denied
```
**Solution:** Verify AWS credentials, check S3 bucket permissions, ensure bucket exists

**Port Already in Use:**
```
Error: listen EADDRINUSE: address already in use :::3002
```
**Solution:** Kill process using the port or change PORT in .env file

**OTP Not Working:**
```
Note: OTP is hardcoded to '123456' in development
```
**Solution:** Integrate real SMS provider for production

---

## Roadmap & Missing Features

For detailed information about missing features and proposed enhancements, see individual API documentation:

- [Customer API Missing Features](apps/customer_api/CUSTOMER_API_DOCUMENTATION.md#missing-features)
- [Merchant API Missing Features](apps/merchant_api/MERCHANT_API_DOCUMENTATION.md#missing-features)
- [Management API Missing Features](apps/management_api/MANAGEMENT_API_DOCUMENTATION.md#missing-features)

**High-Priority Features Across Platform:**
- Payment gateway integration (Stripe, PayPal)
- Real-time order tracking with websockets
- Push notifications (Firebase Cloud Messaging)
- Analytics dashboard for all user types
- Advanced search with Elasticsearch
- Real-time chat support
- Multi-language support expansion
- Automated testing suite
- CI/CD pipeline
- Comprehensive monitoring and alerting

---

## Contributing

### Development Guidelines

1. **Branching Strategy:**
   - `main` - Production-ready code
   - `develop` - Development branch
   - `feature/*` - New features
   - `fix/*` - Bug fixes

2. **Commit Messages:**
   - Use conventional commits format
   - Examples: `feat: add payment integration`, `fix: resolve order status bug`

3. **Pull Requests:**
   - Write clear PR descriptions
   - Link related issues
   - Ensure all tests pass
   - Request code review

4. **Code Review:**
   - Check for security vulnerabilities
   - Verify proper error handling
   - Ensure code follows style guide
   - Test functionality locally

---

## Support & Resources

- **Documentation:** See individual API documentation files
- **Issues:** Report bugs and feature requests on GitHub
- **Questions:** Contact the development team

---

## License

[Specify your license here]

---

## Contact

For questions or support, please contact:
- Email: [your-email@example.com]
- Slack: [your-slack-channel]
- GitHub Issues: [repository-url/issues]
