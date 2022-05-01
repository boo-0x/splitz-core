# PullPayment



> PullPayment



*Sample contract that makes use of the _pull payment_ model with a _withdraw()_ function.*

## Methods

### addressBalance

```solidity
function addressBalance(address) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### deposit

```solidity
function deposit(address receiver) external payable
```



*Receives REEF and adds it to the balance of `receiver`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| receiver | address | undefined |

### withdraw

```solidity
function withdraw() external nonpayable
```



*Implementation of the _pull payment_ model. It checks that the calling address has a positive balance.*





