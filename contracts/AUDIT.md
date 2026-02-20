# Paxr Smart Contract Security Audit

**Date:** February 16, 2026  
**Auditor:** Internal Audit  
**Version:** 1.1 (Fixes Applied)

---

## Executive Summary

This document outlines the security audit findings for the Paxr smart contracts (PaxrEvent, PaxrTicket, PaxrMarketplace). 

### Issues Fixed ✅

1. **Platform Fee Collection** - Now correctly deducts 7% from primary ticket sales
2. **Group Buy Underflow** - Added check to prevent discount > ticket price
3. **Deprecated transfer()** - Replaced with .call{}("")
4. **Sale Start Time** - Now allows immediate starts
5. **UpdateEvent** - Added event existence check
6. **Quantity Limit** - Added max 100 tickets per purchase

---

## Critical Issues (FIXED)

### 1. Platform Fee Not Collected on Primary Sales
**Severity:** CRITICAL  
**Location:** `PaxrEvent.sol:133-166`

The `platformFeePercent` is stored in each event but is **never actually deducted** from ticket purchases. The full ticket price goes directly to the organizer.

```solidity
// Current (BUG):
uint256 totalPrice = evt.ticketPrice * quantity;
(bool success, ) = payable(evt.organizer).call{value: totalPrice}(""); // Full amount to organizer
```

**Fix:** Deduct platform fee before sending to organizer.

---

### 2. Group Buy Price Underflow
**Severity:** CRITICAL  
**Location:** `PaxrEvent.sol:190`

```solidity
uint256 discountedPrice = evt.ticketPrice - evt.groupBuyDiscount;
```

If `groupBuyDiscount > ticketPrice`, this will underflow. No check prevents this.

---

### 3. Deprecated `.transfer()` Usage
**Severity:** HIGH  
**Locations:** 
- `PaxrEvent.sol:145, 266, 271, 292`
- `PaxrMarketplace.sol:104, 107, 152, 155`

Using `.transfer()` is deprecated and can cause issues with EIP-1559 and gas refunds. Should use `.call{}("")` with checks.

---

### 4. saleStartTime Validation Too Restrictive
**Severity:** MEDIUM  
**Location:** `PaxrEvent.sol:102`

```solidity
require(saleStartTime >= block.timestamp, "Sale must start in future");
```

This prevents organizers from creating events that start immediately. Should allow `saleStartTime == block.timestamp`.

---

## Medium Issues

### 5. Missing Event Existence Check
**Location:** `PaxrEvent.sol:319`

The `updateEvent` function checks `eventExists[eventId]` but not if the event was actually created with the correct data.

---

### 6. Integer Overflow in Quantity
**Location:** `PaxrEvent.sol:139`

```solidity
require(evt.ticketsSold + quantity <= evt.totalTickets, "Not enough tickets");
```

While Solidity 0.8+ has built-in overflow checks, very large quantities could still cause issues. Consider adding a max quantity limit.

---

### 7. Incorrect Variable Naming
**Location:** `PaxrTicket.sol:53`

```solidity
uint256 public currentEventId;
```

This tracks token IDs, not event IDs. Should be renamed for clarity.

---

## Recommendations

### High Priority
1. Fix platform fee collection
2. Add group buy underflow protection
3. Replace `.transfer()` with `.call{}("")`

### Medium Priority
4. Allow immediate sale starts
5. Add max quantity limits
6. Rename misleading variables

### Low Priority
7. Add event cancellation functionality
8. Add emergency withdrawal functions
9. Implement pausable contracts

---

## Security Best Practices Already Implemented

- ✅ ReentrancyGuard on critical functions
- ✅ SafeERC20 for token transfers
- ✅ OpenZeppelin contracts (audited)
- ✅ Non-blocking external calls
- ✅ Access control on owner functions
- ✅ Event emissions for all state changes

---

## Conclusion

The contracts have a **critical bug** (missing platform fee collection) that prevents revenue generation. This must be fixed before any mainnet deployment. The other issues, while important, are less critical but should still be addressed for a production-ready system.
