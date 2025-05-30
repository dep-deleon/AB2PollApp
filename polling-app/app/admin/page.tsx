"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Send, Settings, BarChart3, Users } from "lucide-react"
import Link from "next/link"

interface Poll {
  id: string
  question: string
  options: string[]
  timeLimit: number
  isActive: boolean
  totalVotes: number
}

export default function AdminDashboard() {
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: "1",
      question: "What's your favorite way to spend a weekend?",
      options: ["Reading a book", "Outdoor adventures", "Binge-watching shows", "Cooking new recipes"],
      timeLimit: 30,
      isActive: true,
      totalVotes: 40,
    },
  ])

  const [newPoll, setNewPoll] = useState({
    question: "",
    options: ["", ""],
    timeLimit: 30,
  })

  const [isCreating, setIsCreating] = useState(false)

  const addOption = () => {
    setNewPoll({
      ...newPoll,
      options: [...newPoll.options, ""],
    })
  }

  const removeOption = (index: number) => {
    if (newPoll.options.length > 2) {
      setNewPoll({
        ...newPoll,
        options: newPoll.options.filter((_, i) => i !== index),
      })
    }
  }

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...newPoll.options]
    updatedOptions[index] = value
    setNewPoll({
      ...newPoll,
      options: updatedOptions,
    })
  }

  const createPoll = async () => {
    if (!newPoll.question || newPoll.options.some((opt) => !opt.trim())) return

    setIsCreating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const poll: Poll = {
      id: Date.now().toString(),
      question: newPoll.question,
      options: newPoll.options.filter((opt) => opt.trim()),
      timeLimit: newPoll.timeLimit,
      isActive: false,
      totalVotes: 0,
    }

    setPolls([...polls, poll])
    setNewPoll({ question: "", options: ["", ""], timeLimit: 30 })
    setIsCreating(false)
  }

  const launchPoll = async (pollId: string) => {
    // Deactivate all other polls
    const updatedPolls = polls.map((poll) => ({
      ...poll,
      isActive: poll.id === pollId,
    }))
    setPolls(updatedPolls)
  }

  const deletePoll = (pollId: string) => {
    setPolls(polls.filter((poll) => poll.id !== pollId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Settings className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-gray-600">Create and manage your polls</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" className="bg-white/50 hover:bg-blue-50 border-blue-200">
              Client View
            </Button>
          </Link>
          <Link href="/results">
            <Button variant="outline" className="bg-white/50 hover:bg-purple-50 border-purple-200">
              <BarChart3 className="h-4 w-4 mr-2" />
              Results
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Create New Poll */}
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600" />
                Create New Poll
              </CardTitle>
              <CardDescription>Design engaging polls for your audience</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="question">Poll Question</Label>
                <Textarea
                  id="question"
                  placeholder="What would you like to ask your audience?"
                  value={newPoll.question}
                  onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                  className="resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label>Answer Options</Label>
                {newPoll.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1"
                    />
                    {newPoll.options.length > 2 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeOption(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addOption}
                  className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  min="10"
                  max="300"
                  value={newPoll.timeLimit}
                  onChange={(e) => setNewPoll({ ...newPoll, timeLimit: Number.parseInt(e.target.value) || 30 })}
                />
              </div>

              <Button
                onClick={createPoll}
                disabled={!newPoll.question || newPoll.options.some((opt) => !opt.trim()) || isCreating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Poll...
                  </div>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Poll
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Manage Existing Polls */}
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Manage Polls
              </CardTitle>
              <CardDescription>Launch, monitor, and control your polls</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {polls.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No polls created yet</p>
                  </div>
                ) : (
                  polls.map((poll) => (
                    <div
                      key={poll.id}
                      className="p-4 border rounded-lg bg-white/50 hover:bg-white/80 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-800 flex-1">{poll.question}</h4>
                        <div className="flex gap-2">
                          {poll.isActive && <Badge className="bg-green-100 text-green-700">Live</Badge>}
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            <Users className="h-3 w-3 mr-1" />
                            {poll.totalVotes}
                          </Badge>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        {poll.options.length} options • {poll.timeLimit}s timer
                      </div>

                      <div className="flex gap-2">
                        {!poll.isActive ? (
                          <Button
                            size="sm"
                            onClick={() => launchPoll(poll.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Launch
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => launchPoll("")}
                            className="border-orange-300 text-orange-600 hover:bg-orange-50"
                          >
                            Stop Poll
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deletePoll(poll.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
