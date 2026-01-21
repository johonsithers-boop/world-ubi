'use client'

import { useState } from 'react'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card'
import { Verify } from './Verify'
import { useDictionary } from '@/components/providers/DictionaryProvider'

interface Poll {
    id: string
    title: string
    description: string
    options: string[]
    endDate: string
    totalVotes: number
}

interface PollCardProps {
    poll: Poll
    onVote?: (pollId: string, optionIndex: number, nullifierHash: string) => void
}

export function PollCard({ poll, onVote }: PollCardProps) {
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [isVoting, setIsVoting] = useState(false)
    const [hasVoted, setHasVoted] = useState(false)
    const dictionary = useDictionary()

    const handleVoteSuccess = async (result: { nullifier_hash: string }) => {
        if (selectedOption === null) return

        setIsVoting(true)
        try {
            // Submit vote to API
            const response = await fetch('/api/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pollId: poll.id,
                    optionIndex: selectedOption,
                    nullifierHash: result.nullifier_hash
                })
            })

            if (response.ok) {
                setHasVoted(true)
                if (onVote) {
                    onVote(poll.id, selectedOption, result.nullifier_hash)
                }
            }
        } catch (error) {
            console.error('Failed to submit vote:', error)
        } finally {
            setIsVoting(false)
        }
    }

    const endDate = new Date(poll.endDate)
    const isExpired = endDate < new Date()

    return (
        <Card>
            <CardHeader>
                <CardTitle>{poll.title}</CardTitle>
                <CardDescription>{poll.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {poll.options.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => !hasVoted && !isExpired && setSelectedOption(index)}
                            className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${selectedOption === index
                                    ? 'border-gray-900 bg-gray-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                } ${(hasVoted || isExpired) && 'pointer-events-none opacity-60'}`}
                        >
                            <p className="font-medium">{option}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span>{dictionary.govern.totalVotes}: {poll.totalVotes}</span>
                    <span>{dictionary.govern.endDate}: {endDate.toLocaleDateString()}</span>
                </div>

                {!hasVoted && !isExpired && (
                    <Verify
                        action={`vote_poll_${poll.id}`}
                        signal={poll.id}
                        onSuccess={handleVoteSuccess}
                        onError={(error) => console.error(error)}
                    >
                        <Button
                            fullWidth
                            className="mt-4"
                            disabled={selectedOption === null}
                            isLoading={isVoting}
                        >
                            {dictionary.govern.vote}
                        </Button>
                    </Verify>
                )}

                {hasVoted && (
                    <div className="mt-4 text-center text-green-600 font-medium">
                        ✓ {dictionary.govern.voted}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
