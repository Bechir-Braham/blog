# Visualizing System Architecture with Mermaid Diagrams

System architecture diagrams are essential for understanding complex software systems. In this post, I'll demonstrate how Mermaid diagrams can be used to visualize different architectural patterns.

## High-Level System Architecture

Here's a typical microservices architecture:

```mermaid
graph TB
    User[👤 User] --> LB[Load Balancer]
    LB --> API1[API Gateway 1]
    LB --> API2[API Gateway 2]
    
    API1 --> Auth[Authentication Service]
    API1 --> User_Service[User Service]
    API1 --> Order_Service[Order Service]
    
    API2 --> Auth
    API2 --> Payment_Service[Payment Service]
    API2 --> Notification_Service[Notification Service]
    
    User_Service --> UserDB[(User Database)]
    Order_Service --> OrderDB[(Order Database)]
    Payment_Service --> PaymentDB[(Payment Database)]
    
    Order_Service --> Queue[Message Queue]
    Queue --> Notification_Service
    Queue --> Payment_Service
```

## Database Entity Relationships

Here's how our data models relate to each other:

```mermaid
erDiagram
    User {
        int id PK
        string email
        string username
        datetime created_at
        datetime updated_at
    }
    
    Order {
        int id PK
        int user_id FK
        decimal total_amount
        string status
        datetime created_at
        datetime updated_at
    }
    
    OrderItem {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal unit_price
    }
    
    Product {
        int id PK
        string name
        string description
        decimal price
        int inventory_count
    }
    
    Payment {
        int id PK
        int order_id FK
        decimal amount
        string payment_method
        string status
        datetime processed_at
    }
    
    User ||--o{ Order : places
    Order ||--o{ OrderItem : contains
    Product ||--o{ OrderItem : listed_in
    Order ||--|| Payment : has
```

## CI/CD Pipeline Flow

Our deployment pipeline follows this sequence:

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Git as Git Repository
    participant CI as CI Pipeline
    participant Test as Test Environment
    participant Prod as Production
    participant Monitor as Monitoring
    
    Dev->>Git: Push code
    Git->>CI: Trigger webhook
    CI->>CI: Run tests
    CI->>CI: Build Docker image
    CI->>Test: Deploy to staging
    
    Note over Test: Automated testing
    Test->>CI: Tests pass ✅
    
    CI->>Prod: Deploy to production
    Prod->>Monitor: Send metrics
    Monitor->>Dev: Alert if issues
    
    Note over Dev,Monitor: Continuous monitoring
```

## State Machine for Order Processing

Orders go through various states in our system:

```mermaid
stateDiagram-v2
    [*] --> Created : Customer places order
    Created --> Validated : Check inventory & payment
    
    Validated --> Processing : Begin fulfillment
    Processing --> Shipped : Package dispatched
    Shipped --> Delivered : Package received
    Delivered --> [*]
    
    Created --> Cancelled : Customer cancels
    Validated --> Cancelled : Validation fails
    Processing --> Cancelled : Fulfillment issues
    Cancelled --> [*]
    
    Delivered --> Returned : Customer returns item
    Returned --> Refunded : Process refund
    Refunded --> [*]
```

## Git Branch Strategy

Our development workflow uses GitFlow:

```mermaid
gitgraph
    commit id: "Initial"
    branch develop
    checkout develop
    commit id: "Feature A start"
    
    branch feature/auth
    checkout feature/auth
    commit id: "Add login"
    commit id: "Add logout"
    
    checkout develop
    merge feature/auth
    commit id: "Auth integration"
    
    branch release/v1.0
    checkout release/v1.0
    commit id: "Prep v1.0"
    commit id: "Bug fixes"
    
    checkout main
    merge release/v1.0
    commit id: "v1.0 Release"
    
    checkout develop
    merge release/v1.0
    commit id: "Back-merge fixes"
```

These diagrams help visualize complex systems and make architectural decisions more accessible to both technical and non-technical stakeholders.

## Benefits of Visual Documentation

Using Mermaid for system documentation provides several advantages:

- **Version Control**: Diagrams are stored as text, making them easy to track in Git
- **Consistency**: Standardized syntax ensures uniform diagram styling
- **Maintainability**: Updates are simple text edits, not complex graphic manipulations
- **Integration**: Renders directly in markdown, perfect for README files and wikis

Visual documentation bridges the gap between complex technical systems and clear communication, making it an essential tool in any developer's toolkit.