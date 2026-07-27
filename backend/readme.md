


CART FLOW

Validate ObjectId
        │
        ▼
Find Product
        │
        ▼
Product exists?
        │
        ▼
Increase quantity if already in cart
        │
   cart found?
    /       \
  Yes        No
  │           │
Return      Push product
              │
              ▼
      Create cart if needed (upsert)
              │
              ▼
          Return cart






<=====================REMOVE-ITEMS-FROM-CART=======================>
Request
  ↓
User identify karo
  ↓
Cart find karo
  ↓
Product cart mein hai ya nahi check karo
  ↓
Item remove karo
  ↓
Total update karo
  ↓
Save + Response






COMPLETE FLOW OF CREATEOPAYMENT CONTROLLER
Request
   │
   ▼
Validate Inputs
   │
   ▼
Start Transaction
   │
   ▼
Find Order
   │
   ▼
Validate Order
   │
   ▼
Existing Payment?
   │
 ┌─┴─────────────┐
 │               │
No              Yes
 │               │
 │        Failed?
 │               │
 │         ┌─────┴─────┐
 │         │           │
 │       Yes          No
 │         │           │
 │   Reset Payment   Error
 │         │
 ▼         ▼
Create Payment
 │
 ▼
Link Order
 │
 ▼
Commit
 │
 ▼
Response




VERIFY-PAYMENT [BUSINESS LOGIC- CONTROLLER FLOW]
Client
   │
   ▼
POST /payments/verify
   │
   ▼
Receive:
- orderId
- transactionId
- gatewayStatus
- gatewayAmount
   │
   ▼
Validate orderId
Validate transactionId
Validate gatewayStatus
Validate gatewayAmount
   │
   ▼
Start Transaction
   │
   ▼
Find Order
(user + orderId)
   │
   ▼
Order Exists?
   │
   ▼
Find Payment
(user + orderId)
   │
   ▼
Payment Exists?
   │
   ▼
Already Paid?
(paymentStatus === "paid")
   │
   ├── Yes → Error
   │
   ▼
Is Payment Pending?
(paymentStatus === "pending")
   │
   ├── No → Error
   │
   ▼
gatewayAmount === order.totalAmount ?
   │
   ├── No
   │      │
   │      ▼
   │  paymentStatus = "failed"
   │  Commit
   │  Response
   │
   ▼
gatewayStatus === "SUCCESS" ?
        │
 ┌──────┴────────┐
 │               │
Yes             No
 │               │
 ▼               ▼
paymentStatus    paymentStatus
= "paid"         = "failed"

transactionId

paidAt = Date.now()
 │               │
 ▼               ▼
order.paymentStatus = "paid"
order.orderStatus = "confirmed"
 │
 ▼
Save Payment
 │
 ▼
Save Order
 │
 ▼
Commit Transaction
 │
 ▼
Return Success