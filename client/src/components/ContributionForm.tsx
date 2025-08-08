import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, Info, Loader2 } from "lucide-react";

type ContributionType = 'twitter' | 'github' | 'discord' | 'medium';

interface ContributionData {
  type: ContributionType;
  url: string;
  description?: string;
  userId: number;
}

export default function ContributionForm() {
  const [formData, setFormData] = useState({
    type: '' as ContributionType | '',
    url: '',
    description: ''
  });
  const [urlValid, setUrlValid] = useState(false);
  
  const { user, isConnected } = useWallet();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const contributionMutation = useMutation({
    mutationFn: async (data: ContributionData) => {
      const response = await apiRequest('POST', '/api/contributions', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Contribution submitted successfully!",
      });
      setFormData({ type: '', url: '', description: '' });
      setUrlValid(false);
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, url });
    
    if (url && formData.type) {
      setUrlValid(isValidUrl(url) && validateContributionUrl(formData.type, url));
    } else {
      setUrlValid(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !user) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to submit contributions.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.type || !formData.url) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    contributionMutation.mutate({
      type: formData.type,
      url: formData.url,
      description: formData.description,
      userId: user.id
    });
  };

  const contributionTypes = [
    { value: 'twitter' as ContributionType, label: 'Twitter Post (+1 point)' },
    { value: 'github' as ContributionType, label: 'GitHub Commit (+2 points)' },
    { value: 'discord' as ContributionType, label: 'Discord Activity (+1 point)' },
    { value: 'medium' as ContributionType, label: 'Medium Article (+3 points)' },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className={cn(
        "backdrop-blur-md transition-all duration-200 transform hover:scale-[1.01] hover:shadow-lg",
        theme === "light" 
          ? "bg-[#FEF8E8] border-[#302A36]/20" 
          : "bg-[#302A36] border-[#00D4FF]/20"
      )}>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className={cn(
            "text-xl md:text-2xl font-bold font-heading transition-colors duration-200",
            theme === "light" ? "text-[#302A36]" : "text-[#D0FF5F]"
          )}>
            {t('contribution.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Contribution Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className={cn(
                "text-sm md:text-base transition-colors duration-200",
                theme === "light" ? "text-[#302A36]" : "text-[#FEF8E8]"
              )}>
                {t('contribution.type')}
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: ContributionType) => 
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className={cn(
                  "w-full focus:ring-1 transition-all duration-200",
                  theme === "light"
                    ? "bg-[#FEF8E8] border-[#302A36]/30 text-[#302A36] focus:border-[#00D4FF] focus:ring-[#00D4FF]"
                    : "bg-[#302A36] border-gray-600 text-white focus:border-[#00D4FF] focus:ring-[#00D4FF]"
                )}>
                  <SelectValue placeholder={t('contribution.type')} />
                </SelectTrigger>
                <SelectContent className={cn(
                  "transition-all duration-200",
                  theme === "light"
                    ? "bg-[#FEF8E8] border-[#302A36]/30"
                    : "bg-gray-800 border-gray-600"
                )}>
                  {contributionTypes.map((type) => (
                    <SelectItem 
                      key={type.value} 
                      value={type.value} 
                      className={cn(
                        "transition-colors duration-200",
                        theme === "light"
                          ? "text-[#302A36] hover:bg-[#302A36]/10"
                          : "text-white hover:bg-gray-700"
                      )}
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor="url" className={cn(
                "text-sm md:text-base transition-colors duration-200",
                theme === "light" ? "text-[#302A36]" : "text-[#FEF8E8]"
              )}>
                {t('contribution.url.label')}
              </Label>
              <div className="relative">
                <Input
                  id="url"
                  type="url"
                  placeholder={t('url.paste.description')}
                  value={formData.url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className={cn(
                    "w-full pr-10 focus:ring-1 transition-all duration-200",
                    theme === "light"
                      ? "bg-[#FEF8E8] border-[#302A36]/30 text-[#302A36] focus:border-[#00D4FF] focus:ring-[#00D4FF]"
                      : "bg-[#302A36] border-gray-600 text-white focus:border-[#00D4FF] focus:ring-[#00D4FF]"
                  )}
                />
                {urlValid && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
                  </div>
                )}
              </div>
              <p className={cn(
                "text-xs md:text-sm transition-colors duration-200",
                theme === "light" ? "text-[#302A36]/70" : "text-[#FEF8E8]"
              )}>
                {t('url.paste.description')}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className={cn(
                "text-sm md:text-base transition-colors duration-200",
                theme === "light" ? "text-[#302A36]" : "text-[#FEF8E8]"
              )}>
                {t('description.optional')}
              </Label>
              <Textarea
                id="description"
                rows={3}
                placeholder={t('brief.description')}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={cn(
                  "w-full resize-none focus:ring-1 transition-all duration-200",
                  theme === "light"
                    ? "bg-[#FEF8E8] border-[#302A36]/30 text-[#302A36] focus:border-[#00D4FF] focus:ring-[#00D4FF]"
                    : "bg-[#302A36] border-gray-600 text-[#FEF8E8] focus:border-[#00D4FF] focus:ring-[#00D4FF]"
                )}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isConnected || contributionMutation.isPending || !formData.type || !formData.url}
              className={cn(
                "w-full group relative inline-flex items-center justify-center px-4 md:px-6 py-2 md:py-3 font-bold rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4",
                theme === "light"
                  ? "text-[#302A36] bg-gradient-to-r from-[#FEF8E8] via-[#e6e0d0] to-[#e6e0d0] hover:shadow-[#302A36]/20 focus:ring-[#302A36]/30"
                  : "text-[#FEF8E8] bg-gradient-to-r from-[#302A36] via-[#6e7d49] to-[#D0FF5F] hover:shadow-[#D0FF5F]/40 focus:ring-[#D0FF5F]/50"
              )}
            >
              <span className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
              {contributionMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('loading')}
                </>
              ) : (
                t('submit')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Validation Rules */}
      <Card className={cn(
        "transition-all duration-200 transform hover:scale-[1.01] hover:shadow-lg",
        theme === "light" 
          ? "bg-[#FEF8E8] border-[#302A36]/20" 
          : "bg-[#302A36] border-gray-700"
      )}>
        <CardContent className="p-3 md:p-4">
          <h4 className={cn(
            "font-semibold mb-2 flex items-center font-heading transition-colors duration-200 text-sm md:text-base",
            theme === "light" ? "text-[#302A36]" : "text-[#D0FF5F]"
          )}>
            <Info className="h-4 w-4 mr-1 mb-1" />
            {t('validation.rules')}
          </h4>
          <ul className={cn(
            "text-xs md:text-sm space-y-1 transition-colors duration-200",
            theme === "light" ? "text-[#302A36]" : "text-[#FEF8E8]"
          )}>
            <li>• {t('validation.rule.1')}</li>
            <li>• {t('validation.rule.2')}</li>
            <li>• {t('validation.rule.3')}</li>
            <li>• {t('validation.rule.4')}</li>
            <li>• {t('validation.rule.5')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

function validateContributionUrl(type: ContributionType, url: string): boolean {
  const patterns = {
    twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/status\/\d+/,
    github: /^https?:\/\/(www\.)?github\.com\/[\w\-\.]+\/[\w\-\.]+\/(commit|pull)\/[\w\-\.]+/,
    discord: /^https?:\/\/(www\.)?discord\.com\/channels\/\d+\/\d+\/\d+/,
    medium: /^https?:\/\/(www\.)?medium\.com\/@?[\w\-\.]+\/[\w\-\.]+-[\w\-\.]+/
  };
  
  const pattern = patterns[type];
  return pattern ? pattern.test(url) : false;
}
