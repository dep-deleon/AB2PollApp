"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Vote, Sparkles } from "lucide-react"
import Link from "next/link"

interface Poll {
  id: string
  question: string
  options: string[]
  timeLimit: number
  isActive: boolean
  votes: { [key: string]: number }
  totalVotes: number
}

export default function ClientVotingPage() {
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null)
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [hasVoted, setHasVoted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Simulate receiving a poll
  useEffect(() => {
    const samplePoll: Poll = {
      id: "1",
      question: "What's your favorite way to spend a weekend?",
      options: ["Reading a book", "Outdoor adventures", "Binge-watching shows", "Cooking new recipes"],
      timeLimit: 30,
      isActive: true,
      votes: { "Reading a book": 12, "Outdoor adventures": 8, "Binge-watching shows": 15, "Cooking new recipes": 5 },
      totalVotes: 40,
    }
    setCurrentPoll(samplePoll)
    setTimeLeft(30)
  }, [])

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && currentPoll?.isActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, currentPoll?.isActive])

  const handleVote = async () => {
    if (!selectedOption || !currentPoll) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update votes
    const updatedPoll = {
      ...currentPoll,
      votes: {
        ...currentPoll.votes,
        [selectedOption]: (currentPoll.votes[selectedOption] || 0) + 1,
      },
      totalVotes: currentPoll.totalVotes + 1,
    }

    setCurrentPoll(updatedPoll)
    setHasVoted(true)
    setIsLoading(false)
  }

  const getVotePercentage = (option: string) => {
    if (!currentPoll || currentPoll.totalVotes === 0) return 0
    return Math.round(((currentPoll.votes[option] || 0) / currentPoll.totalVotes) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Vote className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PollPulse
            </h1>
            <Sparkles className="h-6 w-6 text-purple-500 animate-pulse" />
          </div>
          <p className="text-gray-600">Your voice matters! Cast your vote now.</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="outline" className="bg-white/50 hover:bg-blue-50 border-blue-200">
              Admin Dashboard
            </Button>
          </Link>
          <Link href="/results">
            <Button variant="outline" className="bg-white/50 hover:bg-purple-50 border-purple-200">
              View Results
            </Button>
          </Link>
        </div>

        {currentPoll ? (
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <Clock className="h-4 w-4 mr-1" />
                  {timeLeft}s left
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <Users className="h-4 w-4 mr-1" />
                  {currentPoll.totalVotes} votes
                </Badge>
              </div>
              <CardTitle className="text-2xl text-gray-800">{currentPoll.question}</CardTitle>
              <CardDescription>Choose your answer below</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {!hasVoted && timeLeft > 0 ? (
                <>
                  <div className="grid gap-3">
                    {currentPoll.options.map((option, index) => (
                      <button
                        key={option}
                        onClick={() => setSelectedOption(option)}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 text-left hover:scale-105 ${
                          selectedOption === option
                            ? "border-blue-500 bg-blue-50 shadow-lg"
                            : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              selectedOption === option ? "border-blue-500 bg-blue-500" : "border-gray-300"
                            }`}
                          >
                            {selectedOption === option && (
                              <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                            )}
                          </div>
                          <span className="font-medium">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={handleVote}
                    disabled={!selectedOption || isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting Vote...
                      </div>
                    ) : (
                      "Cast Your Vote! 🗳️"
                    )}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {hasVoted ? "Thanks for voting! 🎉" : "Poll has ended! ⏰"}
                    </h3>
                    <p className="text-gray-600">Here are the current results:</p>
                  </div>

                  <div className="space-y-3">
                    {currentPoll.options.map((option) => {
                      const percentage = getVotePercentage(option)
                      const votes = currentPoll.votes[option] || 0

                      return (
                        <div key={option} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">{option}</span>
                            <span className="text-sm text-gray-500">
                              {votes} votes ({percentage}%)
                            </span>
                          </div>
                          <Progress value={percentage} className="h-3 bg-gray-200" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
            <CardContent className="text-center py-12">
              <Vote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Polls</h3>
              <p className="text-gray-500">Check back soon for new polls!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
