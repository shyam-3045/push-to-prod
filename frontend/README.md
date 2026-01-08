# 🥬 Farm2Retail – Auction based Produce Allocation

## Overview

Farm2Retail is an auction-based resource allocation platform designed that enables **transparent produce (Fruits & Vegetables) selling, competitive price discovery** between farmers and retailers/wholesalers.

The system focuses on **fair pricing**, **controlled bidding**, while maintaining strict workflow discipline.

This platform is intentionally designed to be **deterministic, role-aware, and state-driven**, ensuring predictable behavior under normal usage as well as under stress.


## Core Roles

### Farmer (Producer)
- Uploads fruits and vegetables to the platform.
- Controls when produce is listed for sale.
- Hands over produce only after successful sale (biding).

### Retailer / Wholesaler (Buyer)
- Views listed produce.
- Competes for produce via live bidding.
- Confirms purchase after winning an auction.


## High-Level System Flow


Each stage follows a **strict order** and cannot be skipped.


## Produce Listing Workflow

1. Farmer uploads produce with:
   - Name
   - Category (Fruit / Vegetable)
   - Total quantity
   - Harvest date
   - Base price per kg

2. Produce is listed as a **single auction unit**, for which the bids are placed.

3. Once listed:
   - Produce details become fixed.
   - Bidding becomes available to buyers. And they can initiate the bidings.

4. Produce remains visible until the auction closes. And at any point of time any retailer can join the auction. 


## Bidding Workflow

- Bidding is **continuous**, not round-based.
- Buyers must always bid **higher than the current highest bid**.
- A minimum increment is enforced to keep bidding fair.
- Bidding is time-bound and automatically closes.
- The current highest bidder cannot bid again unless he is outbid.

Key characteristics:
- Any buyer may enter bidding at any point before closing.
- Only the highest valid bid at closing is considered the winner.
- The system always maintains a single authoritative highest bid.


## Winner Confirmation 

1. The highest bidder is notified after auction closure.
2. The bidder must explicitly **accept or reject** the purchase.
3. If accepted:
    - The auction is closed.
4. If rejected: 
    - The system automatically assigns the next highest eligible bidder, and the same Winner Confirmation is repeated for the new winner.

If no bids exist:
1. The produce is marked as UNSOLD

## System Characteristics

### Role-Based Access
- Only farmers can create produce listings.
- Only retailers/wholesalers can start and place bids.


### State-Driven Workflow
Each produce listing moves through a controlled lifecycle:

CREATED → BIDDING → CLOSED → CONFIRMED / UNSOLD


## What the System Guarantees

- A produce listing has **only one winner**
- Bids cannot be overwritten or duplicated
- Auction rules are enforced uniformly
- No produce data can be modified once bidding begins
- Unauthorized actions do not alter system state

## 🚀 Why This Solution Is Better

Farm2Retail is not just a marketplace; it is a **controlled auction system** built to solve key inefficiencies in traditional agricultural trading.

### Key Advantages

- **Fair Price Discovery**
  - Eliminates middlemen-driven price manipulation
  - Farmers receive competitive market-driven prices

- **Deterministic Auction Logic**
  - Every auction follows strict, predictable rules
  - No ambiguity in winner selection or bid evaluation

- **Role-Isolated Design**
  - Clear separation of responsibilities
  - Prevents unauthorized actions and misuse

- **Server-Authoritative Workflow**
  - All critical decisions are handled on the backend
  - Client-side manipulation does not affect outcomes

- **Scalable & Modular Architecture**
  - Auction logic is isolated from authentication and UI
  - Enables future extensions (logistics, analytics, AI insights)

- **Built for Stress & Adversarial Testing**
  - Handles concurrent bidding safely
  - Rejects invalid or malicious requests without corrupting state

---

## 🌍 Real-World Impact

### For Farmers
- Transparent and competitive pricing for produce
- Direct access to retailers without dependency on intermediaries
- Increased trust in the selling process

### For Retailers / Wholesalers
- Clear visibility into active auctions
- Equal opportunity to participate in price discovery
- Reduced risk of unfair allocation or hidden pricing

### For Agricultural Supply Chains
- Promotes fairness and transparency
- Encourages market-driven valuation
- Lays the foundation for scalable digital agri-commerce platforms

This model can be extended to:
- Regional produce exchanges
- Cooperative farming auctions
- Digital mandis and agri-marketplaces


## 🎥 Demo

A working demonstration of the platform is available here:

**Demo Link:**  
👉 [_\[Video Link\]_](https://vimeo.com/1152642626?share=copy&fl=sv&fe=ci)

The demo walks through:
- User registration and login
- Farmer produce listing
- Live bidding by multiple retailers
- Auction closure and winner confirmation



## 📡 API Documentation

All APIs are protected using **JWT Authentication** and **Role-Based Access Control (RBAC)**.  
Unauthorized access attempts are rejected server-side.



## 🔐 Authentication APIs

### 1. User Registration (Farmer / Retailer)

**Description**  
Registers a new user in the system as either a **Farmer** or **Retailer**.
Registers a new user in the system, either as a Farmer or Retailer based on the role selected.

**Method**  
`POST`

**Endpoint**  
`api/auth/signup`

**Request Body**
```json
{
  "name": "Abc",
  "email": "abc@gmail.com",
  "password": "password123",
  "role": "farmer",
  "address": "520, 5th Street, Coimbatore - 641102"
}

```

**Success Response (201)**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

**Error Response**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

### 2. User Login 

**Description**  
Authenticates a user and returns a JWT token for authorized access.**Retailer**.

**Method**  
`POST`

**Endpoint**  
`/api/auth/login`

**Request Body**
```json
{
  "email": "abc@gmail.com",
  "password": "password123"
}
```

**Success Response (200)**
```json
{
  "success": true,
  "token": "<JWT_TOKEN>"
}
```

**Error Response**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```


## 👨‍🌾 Farmer APIs 
These APIs are accessible only to users with FARMER role.

### 1. Create Produce

**Description**  
Allows a Farmer to list agricultural produce for sale or bidding.**Retailer**.

**Method**  
`POST`

**Endpoint**  
`/api/farmer/createProduce`

**Request Body**
```json
{
  "name": "Tomato",
  "category": "Vegetable",
  "totalQuantityKg": 100,
  "pricePerKg": 30
}
```

**Success Response (201)**
```json
{
  "success": true,
  "message": "Produce listed successfully",
  "produceId": "65fa1b23c9a4"
}
```

**Error Response**
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

## 🏪 Retailer APIs
All Retailer APIs require JWT Authentication    
Only users with RETAILER role can access these endpoints.



### 1. Get Available Produces

**Description**  
Fetches all produce listings currently available for bidding.**Retailer**.

**Method**  
`GET`

**Endpoint**  
`/api/retailer/getProduces`

**Success Response (200)**
```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "_id": "695f8d77142054537db1a2fa",
      "farmerId": "695f84eb013adfc6423b077e",
      "name": "apple",
      "category": "FRUIT",
      "totalQuantityKg": 50,
      "pricePerKg": 30,
      "status": "LISTED",
      "createdAt": "2026-01-08T10:56:55.900Z",
      "updatedAt": "2026-01-08T10:56:55.900Z",
      "farmer": {
        "_id": "695f84eb013adfc6423b077e",
        "name": "DK",
        "address": "abc street"
      }
    }
  ]
}
```

**Error Response**
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```


### 2. Place a Bid

**Description**  
Allows a retailer to place a bid on a produce listing currently open for bidding.**Retailer**.

**Method**  
`POST`

**Endpoint**  
`/api/retailer/bid`

**Request Body**
```json
{
  "produceId": "string",
  "bidAmount": 800
}
```

**Success Response (200)**
```json
{
  "status": "success",
  "message": "Bid placed successfully"
}
```

**Error Response**
```json
{
  "status": "fail",
  "message": "Bidding window closed"
}
```


### 3. Get All Running Bids

**Description**  
Fetch all currently active bidding products and current highest bids.
**Retailer**.

**Method**  
`GET`

**Endpoint**  
`/api/retailer/running-bids`

**Success Response (200)**
```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "_id": "695f8d92142054537db1a2fc",
      "name": "apple",
      "category": "FRUIT",
      "totalQuantityKg": 50,
      "minBidPerBox": 750,
      "bidEndTime": "2026-01-08T13:05:59.473Z",
      "currentBid": {
        "_id": "695f90214326775743d7cda8",
        "retailerId": "695f8de0142054537db1a301",
        "bidAmount": 800,
        "createdAt": "2026-01-08T11:08:17.954Z"
      }
    },
    {
      "_id": "695f8d93142054537db1a2fe",
      "name": "apple",
      "category": "FRUIT",
      "totalQuantityKg": 50,
      "minBidPerBox": 750,
      "bidEndTime": "2026-01-08T13:03:23.506Z",
      "currentBid": {
        "_id": "695f8f014326775743d7cda6",
        "retailerId": "695f8de0142054537db1a301",
        "bidAmount": 750,
        "createdAt": "2026-01-08T11:03:29.949Z"
      }
    }
  ]
}

```

**Error Response**
```json
{
  "status": "fail",
  "message": "Unauthorized"
}
```


## 🐳 Docker Setup & Deployment

The Farm2Retail platform is fully containerized using Docker.  
The system uses **separate containers for frontend and backend**, orchestrated via **Docker Compose** for simplified deployment.

This setup ensures:
- Environment consistency
- Easy local and production deployment
- Clear separation of concerns


## 📦 Docker Components Overview

| Component | Technology | Description |
|---------|------------|-------------|
| Frontend | Next.js | Multi-stage Docker build for optimized production |
| Backend | Node.js | REST API and business logic |
| Orchestration | Docker Compose | Runs frontend and backend together |


## 📁 Project Structure



## 🖥️ Frontend Dockerfile (Next.js – Multi-Stage Build)

**Purpose**
- Builds and serves the Next.js frontend efficiently
- Reduces final image size
- Separates build and runtime environments

**Key Characteristics**
- Uses multi-stage build
- Installs dependencies only once
- Serves optimized production build

**Outcome**
- Lightweight production-ready frontend container
- No development dependencies in final image


## ⚙️ Backend Dockerfile (Node.js API)

**Purpose**
- Runs the backend REST API
- Handles authentication, produce listing, and bidding logic

**Key Characteristics**
- Installs backend dependencies
- Exposes API port
- Runs server in production mode

**Outcome**
- Isolated backend service
- Consistent runtime environment


## 🔗 Docker Compose Configuration

**Purpose**
- Orchestrates frontend and backend containers
- Enables inter-container communication
- Simplifies startup and teardown

**Key Responsibilities**
- Builds images from respective Dockerfiles
- Defines service dependencies
- Maps ports for external access
- Manages shared network


## ▶️ Running the Application

### Prerequisites
- Docker installed
- Docker Compose installed



### Start the Application
From the project root:

```bash
docker-compose up --build 
```

Frontend URL = http://localhost:3000
Backend URL = http://localhost:3000


## 📌 Final Note

Farm2Retail prioritizes **correctness, fairness, and robustness** over unnecessary complexity.

By focusing on a well-defined auction workflow and enforcing strict state transitions, the platform ensures predictable behavior, strong access control, and resistance to misuse—making it suitable for real-world deployment and rigorous evaluation alike.