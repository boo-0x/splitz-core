# Splitz



> Splitz



*This contract allows to split REEF payments among a group of accounts. The sender does not need to be aware that the REEF will be split in this way, since it is handled transparently by the contract. The split can be in equal parts or in any other arbitrary proportion. The way this is specified is by assigning each account to a number of shares. Of all the REEF that this contract receives, each account will then be able to claim an amount proportional to the percentage of total shares they were assigned. `Splitz` follows a _pull payment_ model. This means that payments are not automatically forwarded to the accounts but kept in this contract, and the actual transfer is triggered as a separate step by calling the {release} function. NOTE: This contract assumes that ERC20 tokens will behave similarly to native tokens (Ether). Rebasing tokens, and tokens that apply fees during transfers, are likely to not be supported as expected. If in doubt, we encourage you to run tests before sending real value to this contract.*

## Methods

### available

```solidity
function available(address account) external view returns (uint256)
```



*Returns the amount of REEF owed to `account`, according to their percentage of the total shares and their previous withdrawals.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### availableERC20

```solidity
function availableERC20(contract IERC20 token, address account) external view returns (uint256)
```



*Returns the amount of `token` tokens owed to `account`, according to their percentage of the total shares and their previous withdrawals.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token | contract IERC20 | undefined |
| account | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### getPayees

```solidity
function getPayees() external view returns (struct Splitz.PayeeShare[])
```



*Returns an array with all payees with their respective shares.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | Splitz.PayeeShare[] | undefined |

### release

```solidity
function release(address payable account) external nonpayable
```



*Triggers a transfer to `account` of the amount of REEF they are owed, according to their percentage of the total shares and their previous withdrawals.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address payable | undefined |

### releaseERC20

```solidity
function releaseERC20(contract IERC20 token, address account) external nonpayable
```



*Triggers a transfer to `account` of the amount of `token` tokens they are owed, according to their percentage of the total shares and their previous withdrawals. `token` must be the address of an IERC20 contract.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token | contract IERC20 | undefined |
| account | address | undefined |

### released

```solidity
function released(address) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### releasedERC20

```solidity
function releasedERC20(contract IERC20, address) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | contract IERC20 | undefined |
| _1 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### shares

```solidity
function shares(address) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### totalReleasedERC20

```solidity
function totalReleasedERC20(contract IERC20) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | contract IERC20 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### totalShares

```solidity
function totalShares() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### withdrawFromContract

```solidity
function withdrawFromContract(address addr) external nonpayable
```



*Withdraws available balance for contract with address `addr`. To be used with contracts that implement the _pull payment_ model with a _withdrawal()_ function.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| addr | address | undefined |



## Events

### ERC20PaymentReleased

```solidity
event ERC20PaymentReleased(contract IERC20 indexed token, address indexed to, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token `indexed` | contract IERC20 | undefined |
| to `indexed` | address | undefined |
| amount  | uint256 | undefined |

### PaymentReceived

```solidity
event PaymentReceived(address indexed from, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| from `indexed` | address | undefined |
| amount  | uint256 | undefined |

### PaymentReleased

```solidity
event PaymentReleased(address indexed to, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| to `indexed` | address | undefined |
| amount  | uint256 | undefined |



