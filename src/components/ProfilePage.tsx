'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GiftIcon, SendIcon, GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react"

export function ProfilePage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-600 text-white p-4 md:p-8">
      <div className="w-full max-w-md bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="bg-blue-600 h-20"></div>
        <div className="relative px-4 pb-4">
          <Avatar className="w-24 h-24 border-4 border-white rounded-full absolute -top-12 left-1/2 transform -translate-x-1/2">
            <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile picture" />
            <AvatarFallback>CL</AvatarFallback>
          </Avatar>
          <div className="pt-16 text-center">
            <h1 className="text-2xl font-bold text-gray-800">Chester LaCroix</h1>
            <p className="text-sm text-gray-600 mt-1">
              Short bio here? Do we have this in the profile editing flow somewhere - yes we do
            </p>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <Button variant="outline" className="flex-1">
              <GiftIcon className="w-4 h-4 mr-2" />
              Support builder
            </Button>
            <Button variant="outline" className="flex-1">
              <SendIcon className="w-4 h-4 mr-2" />
              Endorse
            </Button>
          </div>
          <Button variant="secondary" className="w-full mt-4">
            Unlock scheduling for $15
          </Button>
          <div className="flex justify-center gap-4 mt-4">
            <SendIcon className="w-6 h-6 text-blue-600" />
            <GithubIcon className="w-6 h-6 text-blue-600" />
            <LinkedinIcon className="w-6 h-6 text-blue-600" />
            <TwitterIcon className="w-6 h-6 text-blue-600" />
          </div>
          <Tabs defaultValue="endorsements" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="activity">ACTIVITY</TabsTrigger>
              <TabsTrigger value="endorsements">ENDORSEMENTS</TabsTrigger>
            </TabsList>
            <TabsContent value="activity">
              <p className="text-center text-gray-600">Activity content here</p>
            </TabsContent>
            <TabsContent value="endorsements">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Endorsements</h2>
              {[1, 2, 3].map((index) => (
                <Card key={index} className="mb-4 p-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Tina Haibodi" />
                      <AvatarFallback>TH</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-blue-600">Tina Haibodi</h3>
                      <p className="text-sm text-gray-600">August 14th, 2023</p>
                      <p className="text-sm font-semibold mt-1">Friend/Associate</p>
                      <p className="text-sm text-gray-700 mt-2">
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua."
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}