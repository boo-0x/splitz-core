# PaymentSplitterFactory



> PaymentSplitterFactory



*Factory for creating new _PaymentSplitter_ contracts.*

## Methods

### createPaymentSplitter

```solidity
function createPaymentSplitter(address[] payees, uint256[] shares) external nonpayable
```



*Creates an instance of _PaymentSplitter_ where each account in `payees` is assigned the number of shares at the matching position in the `shares` array. Emits a {PaymentSplitterCreated} with the address of the new instance.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| payees | address[] | undefined |
| shares | uint256[] | undefined |

### createPaymentSplitterERC20

```solidity
function createPaymentSplitterERC20(address[] payees, uint256[] shares) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| payees | address[] | undefined |
| shares | uint256[] | undefined |



## Events

### PaymentSplitterCreated

```solidity
event PaymentSplitterCreated(address addr)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| addr  | address | undefined |



