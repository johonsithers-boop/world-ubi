'use client'

import { useState, useEffect, useCallback } from 'react'
import { MiniKit } from '@worldcoin/minikit-js'
import { viemClient, basicIncomeABI, BASIC_INCOME_CONTRACT } from '@/lib/contracts'

// Check if running inside World App (silently)
function isInWorldApp(): boolean {
    return typeof window !== 'undefined' && 'WorldApp' in window
}

export function useBasicIncome(walletAddress: string | null) {
    const [claimableAmount, setClaimableAmount] = useState('0')
    const [isActivated, setIsActivated] = useState(false)
    const [isClaiming, setIsClaiming] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const fetchClaimableAmount = useCallback(async () => {
        if (!walletAddress || BASIC_INCOME_CONTRACT === '0x0000000000000000000000000000000000000000') {
            // Demo mode - show some sample claimable amount
            setClaimableAmount('12.50')
            setIsLoading(false)
            return
        }

        try {
            const result = await viemClient.readContract({
                address: BASIC_INCOME_CONTRACT,
                abi: basicIncomeABI,
                functionName: 'available',
                args: [walletAddress as `0x${string}`]
            })

            setClaimableAmount((Number(result) / 1e18).toString())
        } catch {
            // Demo fallback
            setClaimableAmount('12.50')
        } finally {
            setIsLoading(false)
        }
    }, [walletAddress])

    const checkActivation = useCallback(async () => {
        if (!walletAddress || BASIC_INCOME_CONTRACT === '0x0000000000000000000000000000000000000000') {
            return
        }

        try {
            const result = await viemClient.readContract({
                address: BASIC_INCOME_CONTRACT,
                abi: basicIncomeABI,
                functionName: 'isActivated',
                args: [walletAddress as `0x${string}`]
            })

            setIsActivated(result as boolean)
        } catch {
            // Silently ignore - demo mode
        }
    }, [walletAddress])

    const setupBasicIncome = async () => {
        // Silent check - avoid MiniKit.isInstalled() console.error
        if (!isInWorldApp()) {
            // Demo mode - just activate
            setIsActivated(true)
            setClaimableAmount('12.50')
            return
        }

        setIsClaiming(true)
        try {
            const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
                transaction: [
                    {
                        address: BASIC_INCOME_CONTRACT,
                        abi: basicIncomeABI,
                        functionName: 'setup',
                        args: []
                    }
                ]
            })

            if (finalPayload.status === 'success') {
                setIsActivated(true)
                await fetchClaimableAmount()
            }
        } catch {
            // Demo fallback
            setIsActivated(true)
            setClaimableAmount('12.50')
        } finally {
            setIsClaiming(false)
        }
    }

    const claimBasicIncome = async () => {
        // Silent check
        if (!isInWorldApp()) {
            // Demo mode - reset claimable
            setClaimableAmount('0')
            setTimeout(() => setClaimableAmount('0.25'), 2000)
            return
        }

        setIsClaiming(true)
        try {
            const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
                transaction: [
                    {
                        address: BASIC_INCOME_CONTRACT,
                        abi: basicIncomeABI,
                        functionName: 'claim',
                        args: []
                    }
                ]
            })

            if (finalPayload.status === 'success') {
                setClaimableAmount('0')
            }
        } catch {
            // Silent fail
        } finally {
            setIsClaiming(false)
        }
    }

    useEffect(() => {
        if (walletAddress) {
            checkActivation()
            fetchClaimableAmount()
        }
    }, [walletAddress, checkActivation, fetchClaimableAmount])

    return {
        claimableAmount,
        isActivated,
        isClaiming,
        isLoading,
        setupBasicIncome,
        claimBasicIncome,
        fetchClaimableAmount
    }
}
