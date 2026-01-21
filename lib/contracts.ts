import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

export const viemClient = createPublicClient({
    chain: base,
    transport: http()
})

// Basic Income Contract ABI
export const basicIncomeABI = [
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'available',
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'claim',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'setup',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'isActivated',
        outputs: [{ type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
    }
] as const

// Staking Contract ABI
export const stakingABI = [
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'available',
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ name: 'amount', type: 'uint256' }],
        name: 'stake',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ name: 'amount', type: 'uint256' }],
        name: 'unstake',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'claimRewards',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
] as const

export const BASIC_INCOME_CONTRACT = process.env.NEXT_PUBLIC_BASIC_INCOME_CONTRACT as `0x${string}` || '0x0000000000000000000000000000000000000000'
export const STAKING_CONTRACT = process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}` || '0x0000000000000000000000000000000000000000'
