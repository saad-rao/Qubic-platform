import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Users, Trophy, TrendingUp } from "lucide-react";
import Leaderboard from "./Leaderboard";
import Footer from "./Footer";
import BlogSection from "./BlogSection";
import '../index.css'
import { useTheme } from "@/hooks/useTheme";

export default function VisitorView() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <div className={isLight ? "space-y-6 bg-[#FEF8E8]" : "space-y-6 bg-[#302A36]"}>
      {/* Welcome Message for Visitors */}
      <Card className={isLight ? "mt-16 bg-[#FEF8E8] border-[#302A36]/20" : "mt-16 bg-[#302A36] border-[#00D4FF]/20"}>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div>
              <CardTitle className={isLight ? "text-2xl font-bold text-[#302A36] font-heading" : "text-2xl font-bold text-[#D0FF5F] font-heading"}>
                Welcome to Qubic Ambassador Program
              </CardTitle>
              <p className={isLight ? "text-[#302A36] mt-1" : "text-[#FEFBEB] mt-1"}>
                Discover our top community contributors and their achievements
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Active Ambassadors */}
      <div 
        className={isLight ? "text-center p-4 bg-[#FEF8E8] rounded-lg group border border-[#302A36]/20" : "text-center p-4 bg-gray-800/30 rounded-lg group border border-gray-700/50"}
      >
        <Users className={isLight ? "h-8 w-8 text-[#00D4FF] mx-auto mb-2" : "h-8 w-8 text-[#00D4FF] mx-auto mb-2"} />
        <h3 className={isLight ? "font-semibold text-[#302A36]" : "font-semibold text-[#FEFBEB]"}>
          Active Ambassadors
        </h3>
        <p className="text-2xl font-bold text-[#00D4FF] mt-1">50+</p>
      </div>

      {/* Card 2: Total Contributions */}
      <div 
        className={isLight ? "text-center p-4 bg-[#FEF8E8] rounded-lg group border border-[#302A36]/20" : "text-center p-4 bg-gray-800/30 rounded-lg group border border-gray-700/50"}
      >
        <Trophy className="h-8 w-8 text-[#7B2CBF] mx-auto mb-2" />
        <h3 className={isLight ? "font-semibold text-[#302A36]" : "font-semibold text-[#FEFBEB]"}>
          Total Contributions
        </h3>
        <p className="text-2xl font-bold text-[#7B2CBF] mt-1">1,247</p>
      </div>

      {/* Card 3: Growth This Week */}
      <div 
        className={isLight ? "text-center p-4 bg-[#FEF8E8] rounded-lg group border border-[#302A36]/20" : "text-center p-4 bg-gray-800/30 rounded-lg group border border-gray-700/50"}
      >
        <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
        <h3 className={isLight ? "font-semibold text-[#302A36]" : "font-semibold text-[#FEFBEB]"}>
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
        <Card className={isLight ? "bg-[#FEF8E8] border-[#302A36]/20" : "bg-[#302A36] backdrop-blur-md border-[#00D4FF]/20"}>
          <CardHeader>
            <CardTitle className={isLight ? "text-xl font-semibold text-[#302A36] font-heading" : "text-xl font-semibold text-[#D0FF5F] font-heading"}>
              About the Ambassador Program
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className={isLight ? "text-[#302A36]" : "text-[#FEFBEB]"}>
              The Qubic Ambassador Program recognizes and rewards community members who actively 
              contribute to the growth and success of the Qubic ecosystem.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className={isLight ? "bg-[#00D4FF]/20 text-[#00D4FF] border-[#00D4FF]/30" : "bg-[#00D4FF]/20 text-[#00D4FF] border-[#00D4FF]/30"} variant="outline">
                  🐦 Twitter
                </Badge>
                <span className={isLight ? "text-sm text-[#302A36]" : "text-sm text-[#FEFBEB]"}>Social media engagement</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={isLight ? "bg-[#7B2CBF]/20 text-[#7B2CBF] border-[#7B2CBF]/30" : "bg-[#7B2CBF]/20 text-[#7B2CBF] border-[#7B2CBF]/30"} variant="outline">
                  💻 GitHub
                </Badge>
                <span className={isLight ? "text-sm text-[#302A36]" : "text-sm text-[#FEFBEB]"}>Technical contributions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={isLight ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-green-500/20 text-green-400 border-green-500/30"} variant="outline">
                  📝 Content
                </Badge>
                <span className={isLight ? "text-sm text-[#302A36]" : "text-sm text-[#FEFBEB]"}>Educational content creation</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={isLight ? "bg-[#FEF8E8] border-[#302A36]/20" : "bg-[#302A36] backdrop-blur-md border-[#7B2CBF]/20"}>
          <CardHeader>
            <CardTitle className={isLight ? "text-xl font-semibold text-[#302A36] font-heading" : "text-xl font-semibold text-[#D0FF5F] font-heading"}>
              Join the Community
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className={isLight ? "text-[#302A36]" : "text-[#FEFBEB]"}>
              Interested in becoming a Qubic Ambassador? Connect your wallet to explore 
              opportunities and start contributing to the ecosystem.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-[#00D4FF] rounded-full"></div>
                <span className={isLight ? "text-[#302A36]" : "text-[#FEFBEB]"}>Connect your Qubic wallet</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-[#7B2CBF] rounded-full"></div>
                <span className={isLight ? "text-[#302A36]" : "text-[#FEFBEB]"}>Complete verification process</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className={isLight ? "text-[#302A36]" : "text-[#FEFBEB]"}>Start earning points for contributions</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* <section className={isLight ? "py-16 bg-[#FEF8E8]" : "py-16 bg-[#302A36]"}> */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-6">
        <h2
            className={isLight ? "text-3xl text-bold text-[#302A36] sm:text-4xl font-heading" : "text-3xl text-bold sm:text-4xl font-heading"}
            style={!isLight ? { color: '#D0FF5F' } : {}}
          >
           Why join the program?
          </h2>
          <p className={isLight ? "text-[#302A36]" : "text-[#FEF8E8]"}>
            Become part of the Qubic community and earn rewards for your contributions
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
          {/* Card 1 */}
          <Card className={isLight ? "bg-[#FEF8E8] group border border-[#302A36]/20" : "bg-[rgb(40,35,48)] group border border-gray-700/50"}>
            <CardContent className="p-6 rounded-xl">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className={isLight ? "text-xl font-semibold mb-2 text-[#302A36]" : "text-xl font-semibold mb-2 group-hover:text-[#D0FF5F] transition-colors duration-300"}>
                Community Building
              </h3>
              <p className={isLight ? "text-[#302A36]" : "text-muted-foreground group-hover:text-[#FEFBEB] transition-colors duration-300"}>
                Connect with fellow ambassadors and grow the Qubic community through engaging content and events.
              </p>
            </CardContent>
          </Card>
          {/* Card 2 */}
          <Card className={isLight ? "bg-[#FEF8E8] group border border-[#302A36]/20" : "bg-[rgb(40,35,48)] group border border-gray-700/50"}>
            <CardContent className="p-6 rounded-xl">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className={isLight ? "text-xl font-semibold mb-2 text-[#302A36]" : "text-xl font-semibold mb-2 group-hover:text-[#D0FF5F] transition-colors duration-300"}>
                Track Performance
              </h3>
              <p className={isLight ? "text-[#302A36]" : "text-muted-foreground group-hover:text-[#FEFBEB] transition-colors duration-300"}>
                Monitor your impact with real-time analytics and see how your contributions drive engagement.
              </p>
            </CardContent>
          </Card>
          {/* Card 3 */}
          <Card className={isLight ? "bg-[#FEF8E8] group border border-[#302A36]/20" : "bg-[rgb(40,35,48)] group border border-gray-700/50"}>
            <CardContent className="p-6 rounded-xl">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h3 className={isLight ? "text-xl font-semibold mb-2 text-[#302A36]" : "text-xl font-semibold mb-2 group-hover:text-[#D0FF5F] transition-colors duration-300"}>
                Earn Rewards
              </h3>
              <p className={isLight ? "text-[#302A36]" : "text-muted-foreground group-hover:text-[#FEFBEB] transition-colors duration-300"}>
                Complete tasks and climb the leaderboard to earn points and recognition in the community.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    {/* </section> */}
    <BlogSection />
      <Footer />
    </div>
  );
}