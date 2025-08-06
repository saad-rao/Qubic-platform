import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Users, Trophy, TrendingUp } from "lucide-react";
import Leaderboard from "./Leaderboard";
import Footer from "./Footer";
import BlogSection from "./BlogSection";
import '../index.css'
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

export default function VisitorView() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isLight = theme === "light";
  return (
    <div className={isLight ? "space-y-6 bg-[#FEF8E8]" : "space-y-6 bg-[#302A36]"}>
      {/* Welcome Message for Visitors */}
      <Card className={isLight ? "mt-4 md:mt-16 bg-[#FEF8E8] border-[#302A36]/20" : "mt-4 md:mt-16 bg-[#302A36] border-[#00D4FF]/20"}>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div>
              <CardTitle className={isLight ? "text-xl md:text-2xl font-bold text-[#302A36] font-heading" : "text-xl md:text-2xl font-bold text-[#D0FF5F] font-heading"}>
                {t('ambassador.platform')}
              </CardTitle>
              <p className={isLight ? "text-[#302A36] mt-1 font-text" : "text-[#FEFBEB] mt-1 font-text "}>
                {t('leaderboard.description')}
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
        <Users className={isLight ? "h-6 w-6 md:h-8 md:w-8 text-[#00D4FF] mx-auto mb-2 " : "h-6 w-6 md:h-8 md:w-8 text-[#00D4FF] mx-auto mb-2"} />
        <h3 className={isLight ? "font-semibold text-[#302A36] text-sm md:text-base" : "font-semibold text-[#FEFBEB] text-sm md:text-base"}>
          {t('visitor.active.ambassadors')}
        </h3>
        <p className="text-xl md:text-2xl font-bold text-[#00D4FF] mt-1">50+</p>
      </div>

      {/* Card 2: Total Contributions */}
      <div 
        className={isLight ? "text-center p-4 bg-[#FEF8E8] rounded-lg group border border-[#302A36]/20" : "text-center p-4 bg-gray-800/30 rounded-lg group border border-gray-700/50"}
      >
        <Trophy className="h-6 w-6 md:h-8 md:w-8 text-[#7B2CBF] mx-auto mb-2" />
        <h3 className={isLight ? "font-semibold text-[#302A36] text-sm md:text-base" : "font-semibold text-[#FEFBEB] text-sm md:text-base"}>
          {t('visitor.total.contributions')}
        </h3> 
        <p className="text-xl md:text-2xl font-bold text-[#7B2CBF] mt-1">1,247</p>
      </div>

      {/* Card 3: Growth This Week */}
      <div 
        className={isLight ? "text-center p-4 bg-[#FEF8E8] rounded-lg group border border-[#302A36]/20" : "text-center p-4 bg-gray-800/30 rounded-lg group border border-gray-700/50"}
      >
        <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-400 mx-auto mb-2" />
        <h3 className={isLight ? "font-semibold text-[#302A36] text-sm md:text-base" : "font-semibold text-[#FEFBEB] text-sm md:text-base"}>
          {t('visitor.growth.this.week')}
        </h3>
        <p className="text-xl md:text-2xl font-bold text-green-400 mt-1">+12%</p>
      </div>
    </div>
        </CardContent>
      </Card>

{/* Public Leaderboard */}
<div className="px-4 md:px-0">
  <Leaderboard />
</div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 md:px-0">
        <Card className={isLight ? "bg-[#FEF8E8] border-[#302A36]/20" : "bg-[#302A36] backdrop-blur-md border-[#00D4FF]/20"}>
          <CardHeader>
            <CardTitle className={isLight ? "text-lg md:text-xl font-semibold text-[#302A36] font-heading" : "text-lg md:text-xl font-semibold text-[#D0FF5F] font-heading"}>
              {t('visitor.about.program')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className={isLight ? "text-[#302A36] text-sm md:text-base" : "text-[#FEFBEB] text-sm md:text-base"}>
              {t('visitor.about.description')}
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className={isLight ? "bg-[#00D4FF]/20 text-[#00D4FF] border-[#00D4FF]/30" : "bg-[#00D4FF]/20 text-[#00D4FF] border-[#00D4FF]/30"} variant="outline">
                  {t('visitor.twitter.badge')}
                </Badge>
                <span className={isLight ? "text-sm text-[#302A36]" : "text-sm text-[#FEFBEB]"}>{t('visitor.social.media.engagement')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={isLight ? "bg-[#7B2CBF]/20 text-[#7B2CBF] border-[#7B2CBF]/30" : "bg-[#7B2CBF]/20 text-[#7B2CBF] border-[#7B2CBF]/30"} variant="outline">
                  {t('visitor.github.badge')}
                </Badge>
                <span className={isLight ? "text-sm text-[#302A36]" : "text-sm text-[#FEFBEB]"}>{t('visitor.technical.contributions')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={isLight ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-green-500/20 text-green-400 border-green-500/30"} variant="outline">
                  {t('visitor.content.badge')}
                </Badge>
                <span className={isLight ? "text-sm text-[#302A36]" : "text-sm text-[#FEFBEB]"}>{t('visitor.educational.content')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={isLight ? "bg-[#FEF8E8] border-[#302A36]/20" : "bg-[#302A36] backdrop-blur-md border-[#7B2CBF]/20"}>
          <CardHeader>
            <CardTitle className={isLight ? "text-lg md:text-xl font-semibold text-[#302A36] font-heading" : "text-lg md:text-xl font-semibold text-[#D0FF5F] font-heading"}>
              {t('visitor.join.community')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className={isLight ? "text-[#302A36] text-sm md:text-base" : "text-[#FEFBEB] text-sm md:text-base"}>
              {t('visitor.join.description')}
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-[#00D4FF] rounded-full"></div>
                <span className={isLight ? "text-[#302A36]" : "text-[#FEFBEB]"}>{t('visitor.connect.wallet.step')}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-[#7B2CBF] rounded-full"></div>
                <span className={isLight ? "text-[#302A36]" : "text-[#FEFBEB]"}>{t('visitor.verification.step')}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className={isLight ? "text-[#302A36]" : "text-[#FEFBEB]"}>{t('visitor.start.earning.step')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* <section className={isLight ? "py-16 bg-[#FEF8E8]" : "py-16 bg-[#302A36]"}> */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-6">
        <h2
            className={isLight ? "text-2xl md:text-3xl text-bold text-[#302A36] sm:text-4xl font-heading" : "text-2xl md:text-3xl text-bold sm:text-4xl font-heading"}
            style={!isLight ? { color: '#D0FF5F' } : {}}
          >
           {t('visitor.why.join')}
          </h2>
          <p className={isLight ? "text-[#302A36] text-sm md:text-base" : "text-[#FEF8E8] text-sm md:text-base"}>
            {t('visitor.why.join.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 ">
          {/* Card 1 */}
          <Card className={isLight ? "bg-[#FEF8E8] group border border-[#302A36]/20" : "bg-[rgb(40,35,48)] group border border-gray-700/50"}>
            <CardContent className="p-4 md:p-6 rounded-xl">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
              </div>
              <h3 className={isLight ? "text-lg md:text-xl font-semibold mb-2 text-[#302A36]" : "text-lg md:text-xl font-semibold mb-2 group-hover:text-[#D0FF5F] transition-colors duration-300"}>
                {t('visitor.community.building')}
              </h3>
              <p className={isLight ? "text-[#302A36] text-sm md:text-base" : "text-muted-foreground group-hover:text-[#FEFBEB] transition-colors duration-300 text-sm md:text-base"}>
                {t('visitor.community.building.description')}
              </p>
            </CardContent>
          </Card>
          {/* Card 2 */}
          <Card className={isLight ? "bg-[#FEF8E8] group border border-[#302A36]/20" : "bg-[rgb(40,35,48)] group border border-gray-700/50"}>
            <CardContent className="p-4 md:p-6 rounded-xl">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <h3 className={isLight ? "text-lg md:text-xl font-semibold mb-2 text-[#302A36]" : "text-lg md:text-xl font-semibold mb-2 group-hover:text-[#D0FF5F] transition-colors duration-300"}>
                {t('visitor.track.performance')}
              </h3>
              <p className={isLight ? "text-[#302A36] text-sm md:text-base" : "text-muted-foreground group-hover:text-[#FEFBEB] transition-colors duration-300 text-sm md:text-base"}>
                {t('visitor.track.performance.description')}
              </p>
            </CardContent>
          </Card>
          {/* Card 3 */}
          <Card className={isLight ? "bg-[#FEF8E8] group border border-[#302A36]/20" : "bg-[rgb(40,35,48)] group border border-gray-700/50"}>
            <CardContent className="p-4 md:p-6 rounded-xl">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <h3 className={isLight ? "text-lg md:text-xl font-semibold mb-2 text-[#302A36]" : "text-lg md:text-xl font-semibold mb-2 group-hover:text-[#D0FF5F] transition-colors duration-300"}>
                {t('visitor.earn.rewards')}
              </h3>
              <p className={isLight ? "text-[#302A36] text-sm md:text-base" : "text-muted-foreground group-hover:text-[#FEFBEB] transition-colors duration-300 text-sm md:text-base"}>
                {t('visitor.earn.rewards.description')}
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