import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Users, Trophy, TrendingUp } from "lucide-react";
import Leaderboard from "./Leaderboard";
import Footer from "./Footer";
import BlogSection from "./BlogSection";

export default function VisitorView() {
  return (
    <div className="space-y-6 bg-[#302A36] ">
      {/* Welcome Message for Visitors */}
      <Card className=" mt-16 bg-[#302A36]">
        <CardHeader>
          <div className="flex items-center space-x-3">
            {/* <div className="w-12 h-12 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] rounded-full flex items-center justify-center">
              <Eye className="h-6 w-6 text-white" />
            </div> */}
            <div>
              <CardTitle className="text-2xl font-bold text-[#D0FF5F] ">
                Welcome to Qubic Ambassador Program
              </CardTitle>
              <p className="text-[#FEFBEB] mt-1">
                Discover our top community contributors and their achievements
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Active Ambassadors */}
      <div 
        className="text-center p-4 bg-gray-800/30 rounded-lg opacity-0 animate-fade-in-up [animation-delay:0.2s] transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(0,212,255,0.2),_0_6px_6px_rgba(0,0,0,0.1)] group"
      >
        <Users className="h-8 w-8 text-[#00D4FF] mx-auto mb-2 transition-transform duration-300 group-hover:scale-110" />
        <h3 className="font-semibold text-[#FEFBEB] transition-colors duration-300 group-hover:text-[#00D4FF]">
          Active Ambassadors
        </h3>
        <p className="text-2xl font-bold text-[#00D4FF] mt-1">50+</p>
      </div>

      {/* Card 2: Total Contributions */}
      <div 
        className="text-center p-4 bg-gray-800/30 rounded-lg opacity-0 animate-fade-in-up [animation-delay:0.4s] transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(123,44,191,0.2),_0_6px_6px_rgba(0,0,0,0.1)] group"
      >
        <Trophy className="h-8 w-8 text-[#7B2CBF] mx-auto mb-2 transition-transform duration-300 group-hover:scale-110" />
        <h3 className="font-semibold text-[#FEFBEB] transition-colors duration-300 group-hover:text-[#7B2CBF]">
          Total Contributions
        </h3>
        <p className="text-2xl font-bold text-[#7B2CBF] mt-1">1,247</p>
      </div>

      {/* Card 3: Growth This Week */}
      <div 
        className="text-center p-4 bg-gray-800/30 rounded-lg opacity-0 animate-fade-in-up [animation-delay:0.6s] transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(52,211,153,0.2),_0_6px_6px_rgba(0,0,0,0.1)] group"
      >
        <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110" />
        <h3 className="font-semibold text-[#FEFBEB] transition-colors duration-300 group-hover:text-green-400">
          Growth This Week
        </h3>
        <p className="text-2xl font-bold text-green-400 mt-1">+12%</p>
      </div>
    </div>
        </CardContent>
      </Card>


{/* Public Leaderboard */}
<div className="">
<Leaderboard />
</div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#302A36] backdrop-blur-md border-[#00D4FF]/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#D0FF5F]">
              About the Ambassador Program
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[#FEFBEB]">
              The Qubic Ambassador Program recognizes and rewards community members who actively 
              contribute to the growth and success of the Qubic ecosystem.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className="bg-[#00D4FF]/20 text-[#00D4FF] border-[#00D4FF]/30" variant="outline">
                  🐦 Twitter
                </Badge>
                <span className="text-sm text-[#FEFBEB]">Social media engagement</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-[#7B2CBF]/20 text-[#7B2CBF] border-[#7B2CBF]/30" variant="outline">
                  💻 GitHub
                </Badge>
                <span className="text-sm text-[#FEFBEB]">Technical contributions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30" variant="outline">
                  📝 Content
                </Badge>
                <span className="text-sm text-[#FEFBEB]">Educational content creation</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#302A36] backdrop-blur-md border-[#7B2CBF]/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#D0FF5F]">
              Join the Community
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[#FEFBEB]">
              Interested in becoming a Qubic Ambassador? Connect your wallet to explore 
              opportunities and start contributing to the ecosystem.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-[#00D4FF] rounded-full"></div>
                <span className="text-[#FEFBEB]">Connect your Qubic wallet</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-[#7B2CBF] rounded-full"></div>
                <span className="text-[#FEFBEB]">Complete verification process</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-[#FEFBEB]">Start earning points for contributions</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <section className="py-16 bg-[#302A36]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2 text-[#D0FF5F] animate-fade-in-up opacity-0 animate-delay-0">
            Why Join the Program?
          </h2>
          <p className=" text-[#FEF8E8] animate-fade-in-up opacity-0 animate-delay-400">
            Become part of the Qubic community and earn rewards for your contributions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
          <Card className="bg-[rgb(40,35,48)] group animate-fade-in-up opacity-0 animate-delay-300 hover:scale-105 transition-all duration-300 ease-out transform hover:-translate-y-2 hover:shadow-xl">
            <CardContent className="p-6  rounded-xl hover:bg-[#1a2332] transition-colors duration-300">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <Users className="h-6 w-6 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-[#D0FF5F] transition-colors duration-300">
                Community Building
              </h3>
              <p className="text-muted-foreground group-hover:text-[#FEFBEB] transition-colors duration-300">
                Connect with fellow ambassadors and grow the Qubic community through engaging content and events.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[rgb(40,35,48)] group animate-fade-in-up opacity-0 animate-delay-400 hover:scale-105 transition-all duration-300 ease-out transform hover:-translate-y-2 hover:shadow-xl">
            <CardContent className="p-6  rounded-xl hover:bg-[#1a2332] transition-colors duration-300">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <TrendingUp className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-[#D0FF5F] transition-colors duration-300">
                Track Performance
              </h3>
              <p className="text-muted-foreground group-hover:text-[#FEFBEB] transition-colors duration-300">
                Monitor your impact with real-time analytics and see how your contributions drive engagement.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[rgb(40,35,48)] group animate-fade-in-up opacity-0 animate-delay-500 hover:scale-105 transition-all duration-300 ease-out transform hover:-translate-y-2 hover:shadow-xl">
            <CardContent className="p-6 rounded-xl hover:bg-[#1a2332] transition-colors duration-300">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <Trophy className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-[#D0FF5F] transition-colors duration-300">
                Earn Rewards
              </h3>
              <p className="text-muted-foreground group-hover:text-[#FEFBEB] transition-colors duration-300">
                Complete tasks and climb the leaderboard to earn points and recognition in the community.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
    <BlogSection />
      <Footer />
    </div>
  );
}