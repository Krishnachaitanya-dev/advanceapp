
# Code Review Guidelines - Advance Washing App

## Overview

This document establishes comprehensive code review standards for the Advance Washing application. These guidelines ensure code quality, maintainability, security, and consistency across the entire codebase.

## Table of Contents

1. [Code Review Process](#code-review-process)
2. [Code Quality Standards](#code-quality-standards)
3. [React/TypeScript Guidelines](#reacttypescript-guidelines)
4. [Database & API Guidelines](#database--api-guidelines)
5. [Security Review Checklist](#security-review-checklist)
6. [Performance Review Criteria](#performance-review-criteria)
7. [UI/UX Review Standards](#uiux-review-standards)
8. [Testing Requirements](#testing-requirements)
9. [Documentation Standards](#documentation-standards)
10. [Common Issues & Solutions](#common-issues--solutions)

## Code Review Process

### Review Workflow

1. **Pre-Review Checklist**
   - [ ] Code compiles without errors
   - [ ] All tests pass
   - [ ] ESLint warnings resolved
   - [ ] TypeScript errors resolved
   - [ ] Self-review completed
   - [ ] Documentation updated

2. **Review Assignment**
   - **Frontend Changes**: Senior Frontend Developer
   - **Backend Changes**: Backend/Database Specialist
   - **Security Changes**: Security Team Lead
   - **Major Features**: Technical Lead + Domain Expert

3. **Review Timeline**
   - **Minor Changes**: 24 hours
   - **Major Features**: 48-72 hours
   - **Security Changes**: 48 hours (mandatory)
   - **Emergency Fixes**: 4-8 hours

### Review Criteria

#### Mandatory Approval Required For:
- Database schema changes
- Authentication/authorization modifications
- API endpoint changes
- Security policy updates
- Production configuration changes
- Third-party integrations

#### Review Levels

1. **Level 1 - Basic Review**
   - Code syntax and style
   - Basic functionality
   - No obvious bugs

2. **Level 2 - Thorough Review**
   - Design patterns adherence
   - Performance implications
   - Security considerations
   - Testing coverage

3. **Level 3 - Architectural Review**
   - System design impact
   - Scalability considerations
   - Long-term maintainability
   - Cross-team dependencies

## Code Quality Standards

### General Principles

1. **SOLID Principles**
   - Single Responsibility Principle
   - Open/Closed Principle
   - Liskov Substitution Principle
   - Interface Segregation Principle
   - Dependency Inversion Principle

2. **Clean Code Practices**
   - Meaningful variable and function names
   - Functions should do one thing well
   - Minimize nesting and complexity
   - Consistent formatting and style
   - No magic numbers or hardcoded values

3. **DRY (Don't Repeat Yourself)**
   - Extract common functionality into utilities
   - Use custom hooks for shared logic
   - Create reusable components
   - Centralize configuration

### Code Structure Standards

#### File Organization
```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── feature/         # Feature-specific components
│   └── layout/          # Layout components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── constants/           # Application constants
└── services/            # API service functions
```

#### Naming Conventions

**Files and Directories:**
- `PascalCase` for React components
- `camelCase` for utility functions
- `kebab-case` for non-component files
- Descriptive, meaningful names

**Variables and Functions:**
```typescript
// Good
const getUserOrders = () => { /* ... */ };
const isAuthenticated = user !== null;
const ORDER_STATUS_PENDING = 'pending';

// Bad
const getUO = () => { /* ... */ };
const flag = user !== null;
const PENDING = 'pending';
```

**Components:**
```typescript
// Good
const OrderDetailsModal = () => { /* ... */ };
const ServiceSelectionGrid = () => { /* ... */ };

// Bad
const Modal = () => { /* ... */ };
const Component1 = () => { /* ... */ };
```

## React/TypeScript Guidelines

### Component Design Standards

#### 1. Component Structure
```typescript
// Good component structure
import React, { memo, useState, useEffect } from 'react';
import { SomeType } from '@/types';

interface ComponentProps {
  data: SomeType;
  onAction: (id: string) => void;
  isLoading?: boolean;
}

const ComponentName = memo<ComponentProps>(({
  data,
  onAction,
  isLoading = false
}) => {
  // State declarations
  const [localState, setLocalState] = useState<string>('');
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependency]);
  
  // Event handlers
  const handleAction = useCallback((id: string) => {
    onAction(id);
  }, [onAction]);
  
  // Early returns
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Main render
  return (
    <div className="component-container">
      {/* Component content */}
    </div>
  );
});

ComponentName.displayName = 'ComponentName';
export default ComponentName;
```

#### 2. TypeScript Best Practices

**Interface Definitions:**
```typescript
// Good - Descriptive and complete
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
  lastLoginAt: Date | null;
}

// Bad - Vague and incomplete
interface User {
  id: string;
  data: any;
}
```

**Generic Types:**
```typescript
// Good - Reusable and type-safe
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

// Usage
const orders: ApiResponse<Order[]> = await fetchOrders();
```

#### 3. Hook Design Patterns

**Custom Hook Structure:**
```typescript
interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useOrders = (userId?: string): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getOrders(userId);
      setOrders(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  return { orders, loading, error, refetch: fetchOrders };
};
```

### Performance Optimization

#### 1. Memoization Guidelines
```typescript
// Use memo for expensive components
const ExpensiveComponent = memo(({ data }) => {
  // Expensive rendering logic
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return data.reduce((acc, item) => acc + item.value, 0);
}, [data]);

// Use useCallback for stable function references
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);
```

#### 2. Bundle Optimization
```typescript
// Good - Lazy loading for routes
const LazyComponent = lazy(() => import('./HeavyComponent'));

// Good - Tree shaking friendly imports
import { Button } from '@/components/ui/button';

// Bad - Imports entire library
import * as utils from 'lodash';
```

## Database & API Guidelines

### Supabase Integration Standards

#### 1. Query Patterns
```typescript
// Good - Specific field selection
const { data, error } = await supabase
  .from('orders')
  .select('id, status, created_at, user_id')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });

// Bad - Select all fields
const { data, error } = await supabase
  .from('orders')
  .select('*');
```

#### 2. Error Handling
```typescript
// Good - Comprehensive error handling
const fetchUserOrders = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Fetch orders error:', error);
    throw error;
  }
};
```

#### 3. RLS Policy Verification
```sql
-- Example policy review checklist
-- ✓ Policy exists for all CRUD operations
-- ✓ User isolation properly implemented
-- ✓ Admin override functionality works
-- ✓ No security leaks in complex queries

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id OR is_admin());
```

### API Design Standards

#### 1. Service Layer Structure
```typescript
// Good - Centralized API service
class OrderService {
  static async getOrders(userId?: string): Promise<Order[]> {
    const query = supabase
      .from('orders')
      .select(`
        *,
        bookings!inner(*),
        order_items(*)
      `);
    
    if (userId && !isAdmin()) {
      query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }
  
  static async updateOrderStatus(
    orderId: string, 
    status: OrderStatus
  ): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
```

## Security Review Checklist

### Authentication & Authorization

- [ ] **Authentication Flow**
  - JWT tokens properly validated
  - Session management secure
  - Password requirements enforced
  - Failed login attempts limited

- [ ] **Authorization Logic**
  - Role-based access properly implemented
  - User data isolation enforced
  - Admin privileges correctly scoped
  - API endpoints protected

- [ ] **Data Protection**
  - Sensitive data encrypted
  - PII handling compliant
  - Data validation implemented
  - SQL injection prevention

### Input Validation

```typescript
// Good - Comprehensive validation
const orderSchema = z.object({
  serviceIds: z.array(z.string().uuid()),
  addressId: z.string().uuid(),
  pickupDate: z.string().datetime(),
  specialInstructions: z.string().max(500).optional(),
});

// Validation usage
const validateOrderData = (data: unknown) => {
  try {
    return orderSchema.parse(data);
  } catch (error) {
    throw new ValidationError('Invalid order data', error);
  }
};
```

### Security Best Practices

- [ ] **Environment Variables**
  - No secrets in client-side code
  - Proper secret management
  - Environment-specific configuration

- [ ] **Error Handling**
  - No sensitive data in error messages
  - Proper error logging
  - User-friendly error messages

## Performance Review Criteria

### Frontend Performance

#### 1. Bundle Analysis
```bash
# Check bundle size
npm run build -- --analyze

# Performance budget
- Initial bundle: < 250KB
- Route chunks: < 100KB
- Individual components: < 50KB
```

#### 2. Runtime Performance
- [ ] **Rendering Performance**
  - No unnecessary re-renders
  - Proper key usage in lists
  - Memoization where appropriate
  - Virtual scrolling for large lists

- [ ] **Network Performance**
  - API response caching
  - Image optimization
  - Lazy loading implementation
  - Prefetching critical resources

#### 3. Database Performance
```sql
-- Query performance checklist
-- ✓ Proper indexes on frequently queried columns
-- ✓ No N+1 query problems
-- ✓ Appropriate use of joins
-- ✓ Query result pagination

EXPLAIN ANALYZE SELECT * FROM orders 
WHERE user_id = $1 
ORDER BY created_at DESC 
LIMIT 20;
```

### Mobile Performance

- [ ] **Touch Interactions**
  - Touch targets ≥ 44px
  - No 300ms click delay
  - Smooth scrolling
  - Haptic feedback where appropriate

- [ ] **Resource Usage**
  - Memory usage optimized
  - CPU usage reasonable
  - Battery impact minimized
  - Network usage efficient

## UI/UX Review Standards

### Design System Compliance

#### 1. Component Usage
```typescript
// Good - Using design system components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const OrderCard = ({ order }) => (
  <Card className="p-4">
    <Button variant="outline" size="sm">
      View Details
    </Button>
  </Card>
);

// Bad - Custom styling outside design system
const OrderCard = ({ order }) => (
  <div className="border rounded p-4 bg-white shadow">
    <button className="px-3 py-1 border rounded text-sm">
      View Details
    </button>
  </div>
);
```

#### 2. Responsive Design
- [ ] **Breakpoint Testing**
  - Mobile (320px - 768px)
  - Tablet (768px - 1024px)
  - Desktop (1024px+)

- [ ] **Touch-Friendly Design**
  - Appropriate touch targets
  - Gesture support
  - Thumb-friendly navigation

#### 3. Accessibility Standards
```typescript
// Good - Accessible component
const AccessibleButton = ({ onClick, children, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label="Place order"
    className="focus:ring-2 focus:ring-blue-500"
  >
    {children}
  </button>
);
```

- [ ] **WCAG 2.1 AA Compliance**
  - Keyboard navigation support
  - Screen reader compatibility
  - Color contrast ratios ≥ 4.5:1
  - Focus indicators visible

### User Experience

- [ ] **Loading States**
  - Skeleton screens for data loading
  - Progress indicators for long operations
  - Appropriate loading spinners
  - Error state handling

- [ ] **Form Validation**
  - Real-time validation feedback
  - Clear error messages
  - Prevention of invalid submissions
  - Success confirmation

## Testing Requirements

### Unit Testing

```typescript
// Example test structure
describe('OrderService', () => {
  describe('getOrders', () => {
    it('should fetch user orders for regular users', async () => {
      // Arrange
      const mockUser = { id: 'user-123', role: 'user' };
      const mockOrders = [{ id: 'order-1', user_id: 'user-123' }];
      
      // Act
      const orders = await OrderService.getOrders(mockUser.id);
      
      // Assert
      expect(orders).toEqual(mockOrders);
      expect(supabase.from).toHaveBeenCalledWith('orders');
    });
    
    it('should handle database errors gracefully', async () => {
      // Test error handling
    });
  });
});
```

### Integration Testing

- [ ] **API Integration**
  - Supabase connection testing
  - RLS policy verification
  - Error scenario testing

- [ ] **User Flow Testing**
  - Complete order placement flow
  - Authentication flow
  - Admin operations flow

### E2E Testing

```typescript
// Example E2E test
describe('Order Placement Flow', () => {
  it('should allow user to place an order', () => {
    cy.login('user@example.com', 'password');
    cy.visit('/services');
    cy.selectService('Wash & Fold');
    cy.clickButton('Schedule Pickup');
    cy.selectAddress('Home');
    cy.selectDate('tomorrow');
    cy.selectTime('9:00 AM - 12:00 PM');
    cy.clickButton('Confirm Order');
    cy.contains('Order placed successfully');
  });
});
```

## Documentation Standards

### Code Documentation

#### 1. JSDoc Comments
```typescript
/**
 * Creates a new order with the specified services and booking details
 * @param orderData - The order information including services and pickup details
 * @param orderData.serviceIds - Array of service IDs to include in the order
 * @param orderData.addressId - Delivery address ID
 * @param orderData.pickupDate - Scheduled pickup date in ISO format
 * @returns Promise resolving to the created order with generated order number
 * @throws {ValidationError} When order data is invalid
 * @throws {AuthenticationError} When user is not authenticated
 * @example
 * ```typescript
 * const order = await createOrder({
 *   serviceIds: ['service-1', 'service-2'],
 *   addressId: 'addr-123',
 *   pickupDate: '2023-12-07T10:00:00Z'
 * });
 * ```
 */
export const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
  // Implementation
};
```

#### 2. README Updates
- [ ] **Feature Documentation**
  - New feature usage instructions
  - Configuration requirements
  - Examples and use cases

- [ ] **API Documentation**
  - Endpoint descriptions
  - Request/response formats
  - Error codes and handling

### Database Documentation

```sql
-- Table documentation
COMMENT ON TABLE orders IS 'Stores customer orders with lifecycle tracking';
COMMENT ON COLUMN orders.status IS 'Order status: pending, confirmed, picked_up, in_process, ready_for_delivery, delivered, cancelled';
COMMENT ON COLUMN orders.final_weight IS 'Actual weight measured after pickup, used for final pricing';
```

## Common Issues & Solutions

### Frequent Code Review Issues

#### 1. TypeScript Issues
```typescript
// Problem: Using 'any' type
const data: any = await fetchData();

// Solution: Proper typing
const data: ApiResponse<Order[]> = await fetchData();

// Problem: Missing error handling
const order = await api.getOrder(id);

// Solution: Comprehensive error handling
try {
  const order = await api.getOrder(id);
  return order;
} catch (error) {
  console.error('Failed to fetch order:', error);
  throw new Error('Unable to load order details');
}
```

#### 2. React Performance Issues
```typescript
// Problem: Object creation in render
const style = { color: 'red', fontSize: '14px' };

// Solution: Move outside component or use useMemo
const errorStyle = { color: 'red', fontSize: '14px' };

// Problem: Inline function in JSX
<Button onClick={() => handleClick(id)}>Click</Button>

// Solution: useCallback or extract function
const handleButtonClick = useCallback(() => handleClick(id), [handleClick, id]);
<Button onClick={handleButtonClick}>Click</Button>
```

#### 3. Security Issues
```typescript
// Problem: Direct DOM manipulation
document.getElementById('user-name').innerHTML = userName;

// Solution: React state management
const [userName, setUserName] = useState('');
<span>{userName}</span>

// Problem: Hardcoded secrets
const API_KEY = 'sk-1234567890abcdef';

// Solution: Environment variables
const API_KEY = process.env.REACT_APP_API_KEY;
```

### Review Checklist Template

```markdown
## Code Review Checklist

### Functionality
- [ ] Code works as intended
- [ ] Edge cases handled
- [ ] Error handling implemented
- [ ] Input validation present

### Code Quality
- [ ] Follows coding standards
- [ ] No code duplication
- [ ] Proper naming conventions
- [ ] Comments where necessary

### Performance
- [ ] No performance regressions
- [ ] Efficient algorithms used
- [ ] Database queries optimized
- [ ] Bundle size acceptable

### Security
- [ ] Input sanitization
- [ ] Authentication checks
- [ ] Authorization verification
- [ ] No sensitive data exposure

### Testing
- [ ] Unit tests included
- [ ] Integration tests updated
- [ ] Manual testing completed
- [ ] Edge cases tested

### Documentation
- [ ] Code comments added
- [ ] README updated
- [ ] API docs updated
- [ ] Change log updated
```

This comprehensive code review guide ensures consistent, high-quality code across the Advance Washing application while maintaining security, performance, and maintainability standards.
