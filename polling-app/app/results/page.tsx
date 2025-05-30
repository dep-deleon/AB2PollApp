"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, TrendingUp, Award, RefreshCw } from "lucide-react"
import Link from "next/link"

interface PollResult {
  id: string
  question: string
  options: string[]
  votes: { [key: string]: number }
  totalVotes: number
  isActive: boolean
  createdAt: string
}

export default function ResultsPage() {
  const [pollResults, setPollResults] = useState<PollResult[]>([
    {
      id: "1",
      question: "What's your favorite way to spend a weekend?",
      options: ["Reading a book", "Outdoor adventures", "Binge-watching shows", "Cooking new recipes"],
      votes: { "Reading a book": 12, "Outdoor adventures": 8, "Binge-watching shows": 15, "Cooking new recipes": 5 },
      totalVotes: 40,
      isActive: true,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      question: "Which programming language should we focus on next?",
      options: ["Python", "JavaScript", "Rust", "Go"],
      votes: { Python: 25, JavaScript: 18, Rust: 12, Go: 8 },
      totalVotes: 63,
      isActive: false,
      createdAt: "2024-01-10",
    },
  ])

  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshResults = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const getVotePercentage = (poll: PollResult, option: string) => {
    if (poll.totalVotes === 0) return 0
    return Math.round(((poll.votes[option] || 0) / poll.totalVotes) * 100)
  }

  const getWinningOption = (poll: PollResult) => {
    let maxVotes = 0
    let winner = ""

    for (const [option, votes] of Object.entries(poll.votes)) {
      if (votes > maxVotes) {
        maxVotes = votes
        winner = option
      }
    }

    return { option: winner, votes: maxVotes }
  }

  const totalVotesAcrossPolls = pollResults.reduce((sum, poll) => sum + poll.totalVotes, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Poll Results
            </h1>
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-gray-600">Real-time insights from your audience</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" className="bg-white/50 hover:bg-blue-50 border-blue-200">
              Client View
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" className="bg-white/50 hover:bg-purple-50 border-purple-200">
              Admin Dashboard
            </Button>
          </Link>
          <Button
            onClick={refreshResults}
            disabled={isRefreshing}
            variant="outline"
            className="bg-white/50 hover:bg-green-50 border-green-200"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Polls</p>
                  <p className="text-2xl font-bold text-gray-800">{pollResults.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Votes</p>
                  <p className="text-2xl font-bold text-gray-800">{totalVotesAcrossPolls}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Polls</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {pollResults.filter((poll) => poll.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Poll Results */}
        <div className="space-y-6">
          {pollResults.map((poll) => {
            const winner = getWinningOption(poll)

            return (
              <Card key={poll.id} className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-800 mb-2">{poll.question}</CardTitle>
                      <CardDescription>Created on {new Date(poll.createdAt).toLocaleDateString()}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {poll.isActive && <Badge className="bg-green-100 text-green-700">Live Poll</Badge>}
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        <Users className="h-3 w-3 mr-1" />
                        {poll.totalVotes} votes
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Winner Highlight */}
                  {poll.totalVotes > 0 && (
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-5 w-5 text-yellow-600" />
                        <span className="font-semibold text-yellow-800">Leading Option</span>
                      </div>
                      <p className="text-gray-700">
                        <span className="font-medium">{winner.option}</span> with {winner.votes} votes (
                        {getVotePercentage(poll, winner.option)}%)
                      </p>
                    </div>
                  )}

                  {/* Detailed Results */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Detailed Breakdown</h4>
                    {poll.options.map((option) => {
                      const votes = poll.votes[option] || 0
                      const percentage = getVotePercentage(poll, option)
                      const isWinner = option === winner.option

                      return (
                        <div key={option} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${isWinner ? "text-yellow-700" : "text-gray-700"}`}>
                                {option}
                              </span>
                              {isWinner && <Award className="h-4 w-4 text-yellow-500" />}
                            </div>
                            <span className="text-sm text-gray-500">
                              {votes} votes ({percentage}%)
                            </span>
                          </div>
                          <Progress
                            value={percentage}
                            className={`h-3 ${isWinner ? "bg-yellow-100" : "bg-gray-200"}`}
                          />
                        </div>
                      )
                    })}
                  </div>

                  {poll.totalVotes === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No votes yet for this poll</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {pollResults.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
            <CardContent className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Poll Results</h3>
              <p className="text-gray-500">Create some polls to see results here!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
