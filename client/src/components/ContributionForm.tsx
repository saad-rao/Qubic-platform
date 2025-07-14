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
    <div className="space-y-6">
      <Card className="bg-[#302A36] backdrop-blur-md border-[#00D4FF]/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#D0FF5F] font-heading">
            Submit New Contribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contribution Type */}
            <div className="space-y-2 text-[FEF8E8]">
              <Label htmlFor="type">Contribution Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: ContributionType) => 
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="w-full bg-[#302A36] border-gray-600 text-white focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF]">
                  <SelectValue placeholder="Select contribution type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {contributionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-white hover:bg-gray-700">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* URL Input */}
            <div className="space-y-2 text-[FEF8E8] ">
              <Label htmlFor="url">Contribution URL</Label>
              <div className="relative">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://twitter.com/your-post or https://github.com/your-commit"
                  value={formData.url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full bg-[#302A36] border-gray-600 text-white focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] pr-10"
                />
                {urlValid && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                )}
              </div>
              <p className="text-sm text-[#FEF8E8]">
                Paste the URL of your contribution (Twitter post, GitHub commit, etc.)
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2 text-[FEF8E8]">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Brief description of your contribution..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#302A36] border-gray-600 text-[#FEF8E8] focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isConnected || contributionMutation.isPending || !formData.type || !formData.url}
              className="  w-full group relative inline-flex items-center justify-center px-6 py-3 font-bold text-[#FEF8E8] bg-gradient-to-r from-[#302A36] via-[#6e7d49] to-[#D0FF5F] rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:shadow-[#D0FF5F]/40 focus:outline-none focus:ring-4 focus:ring-[#D0FF5F]/50"
            >
             
              {contributionMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Submit Contribution'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Validation Rules */}
      <Card className="bg-[#302A36] border-gray-700">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 text-[#D0FF5F] flex items-center font-heading">
            <Info className="h-4 w-4 mr-1 mb-1 " />
            Validation Rules
          </h4>
          <ul className="text-sm text-[#FEF8E8] space-y-1">
            <li>• URLs must be public and accessible</li>
            <li>• Twitter posts must mention @QubicOfficial or #Qubic</li>
            <li>• GitHub commits must be in Qubic-related repositories</li>
            <li>• Duplicate submissions will be rejected</li>
            <li>• Each contribution type has a cooldown period</li>
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
