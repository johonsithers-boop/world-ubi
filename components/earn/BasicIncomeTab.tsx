'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { useBasicIncome } from '@/hooks/useBasicIncome'
import { useDictionary } from '@/components/providers/DictionaryProvider'
import { formatBalance } from '@/lib/utils'
import { PiCoins } from 'react-icons/pi'

interface BasicIncomeTabProps {
    walletAddress: string | null
}

export function BasicIncomeTab({ walletAddress }: BasicIncomeTabProps) {
    const dictionary = useDictionary()
    const {
        claimableAmount,
        isActivated,
        isClaiming,
        setupBasicIncome,
        claimBasicIncome
    } = useBasicIncome(walletAddress)

    const t = dictionary.earn.tabs.basicIncome

    if (!isActivated) {
        return (
            <div className="w-full">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <PiCoins className="h-8 w-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">{t.title}</CardTitle>
                        <CardDescription className="text-base">{t.setupSubtitle}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={setupBasicIncome}
                            isLoading={isClaiming}
                            fullWidth
                            size="lg"
                        >
                            {isClaiming ? t.activating : t.activateButton}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="w-full">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                        <PiCoins className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm text-green-600 font-medium">✓ {t.activated}</p>
                    <CardDescription>{t.claimableSubtitle}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-5xl font-bold text-gray-900 mb-2">
                        {formatBalance(claimableAmount)}
                    </p>
                    <p className="text-gray-500 mb-6">WLD</p>

                    <Button
                        onClick={claimBasicIncome}
                        isLoading={isClaiming}
                        disabled={parseFloat(claimableAmount) === 0}
                        fullWidth
                        size="lg"
                    >
                        {isClaiming ? t.claiming : t.claimButton}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
