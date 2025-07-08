import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Users, Trophy, TrendingUp } from "lucide-react";
import Leaderboard from "./Leaderboard";
import Footer from "./Footer";

export default function VisitorView() {
  return (
    <div className="space-y-6 ">
      {/* Welcome Message for Visitors */}
      <Card className=" mt-16 bg-gray-900/50">
        <CardHeader>
          <div className="flex items-center space-x-3">
            {/* <div className="w-12 h-12 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] rounded-full flex items-center justify-center">
              <Eye className="h-6 w-6 text-white" />
            </div> */}
            <div>
              <CardTitle className="text-2xl font-bold text-[#00D4FF] ">
                Welcome to Qubic Ambassador Program
              </CardTitle>
              <p className="text-[#A5A5A5] mt-1">
                Discover our top community contributors and their achievements
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-800/30 rounded-lg">
              <Users className="h-8 w-8 text-[#00D4FF] mx-auto mb-2" />
              <h3 className="font-semibold text-white">Active Ambassadors</h3>
              <p className="text-2xl font-bold text-[#00D4FF] mt-1">50+</p>
            </div>
            <div className="text-center p-4 bg-gray-800/30 rounded-lg">
              <Trophy className="h-8 w-8 text-[#7B2CBF] mx-auto mb-2" />
              <h3 className="font-semibold text-white">Total Contributions</h3>
              <p className="text-2xl font-bold text-[#7B2CBF] mt-1">1,247</p>
            </div>
            <div className="text-center p-4 bg-gray-800/30 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Growth This Week</h3>
              <p className="text-2xl font-bold text-green-400 mt-1">+12%</p>
            </div>
          </div>
        </CardContent>
      </Card>
{/* Public Leaderboard */}
<Leaderboard />
      {/* Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 backdrop-blur-md border-[#00D4FF]/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#00D4FF]">
              About the Ambassador Program
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[#A5A5A5]">
              The Qubic Ambassador Program recognizes and rewards community members who actively 
              contribute to the growth and success of the Qubic ecosystem.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className="bg-[#00D4FF]/20 text-[#00D4FF] border-[#00D4FF]/30" variant="outline">
                  🐦 Twitter
                </Badge>
                <span className="text-sm text-[#A5A5A5]">Social media engagement</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-[#7B2CBF]/20 text-[#7B2CBF] border-[#7B2CBF]/30" variant="outline">
                  💻 GitHub
                </Badge>
                <span className="text-sm text-[#A5A5A5]">Technical contributions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30" variant="outline">
                  📝 Content
                </Badge>
                <span className="text-sm text-[#A5A5A5]">Educational content creation</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-md border-[#7B2CBF]/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#7B2CBF]">
              Join the Community
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[#A5A5A5]">
              Interested in becoming a Qubic Ambassador? Connect your wallet to explore 
              opportunities and start contributing to the ecosystem.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-[#00D4FF] rounded-full"></div>
                <span className="text-[#A5A5A5]">Connect your Qubic wallet</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-[#7B2CBF] rounded-full"></div>
                <span className="text-[#A5A5A5]">Complete verification process</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-[#A5A5A5]">Start earning points for contributions</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <section className="py-16 bg-card bg-gray-900/50 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[#00D4FF]">Why Join the Program?</h2>
            <p className="text-muted-foreground text-[#9A9B9C]">
              Become part of the Qubic community and earn rewards for your contributions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="qubic-stat-card">
              <CardContent className="p-6 bg-[#131927] rounded-lg ">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Building</h3>
                <p className="text-muted-foreground">
                  Connect with fellow ambassadors and grow the Qubic community through engaging content and events.
                </p>
              </CardContent>
            </Card>

            <Card className="qubic-stat-card">
              <CardContent className="p-6 bg-[#131927] rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Performance</h3>
                <p className="text-muted-foreground">
                  Monitor your impact with real-time analytics and see how your contributions drive engagement.
                </p>
              </CardContent>
            </Card>

            <Card className="qubic-stat-card">
              <CardContent className="p-6 bg-[#131927] rounded-lgs">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Earn Rewards</h3>
                <p className="text-muted-foreground">
                  Complete tasks and climb the leaderboard to earn points and recognition in the community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}