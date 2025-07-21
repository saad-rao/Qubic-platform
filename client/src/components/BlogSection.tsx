import React, { useState } from 'react';
import blogsData from '../data/blogs.json';
import { ChevronRight } from 'lucide-react';
import { useTheme } from "@/hooks/useTheme";

// Define the type for a single blog post
interface Blog {
  id: number;
  title: string;
  description: string;
  content: string;
  date: string;
  image: string;
}

// Helper function to format the date
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Define props for the BlogCard component
interface BlogCardProps {
  blog: Blog;
  isExpanded: boolean;
  onToggle: () => void;
}

// --- Main Blog Card Component ---

const BlogCard: React.FC<BlogCardProps> = ({ blog, isExpanded, onToggle }) => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <div className={isLight ? "group bg-[#FEF8E8] border border-[#302A36]/20 rounded-xl overflow-hidden transition-all duration-300 ease-in-out hover:border-[#302A36]/40 hover:shadow-2xl hover:shadow-[#302A36]/10 hover:-translate-y-2" : "group bg-card-dark border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 ease-in-out hover:border-accent-blue/60 hover:shadow-2xl hover:shadow-accent-blue/10 hover:-translate-y-2"}>
      {/* Blog Image with a zoom effect on hover */}
      <div className="overflow-hidden">
        <img 
          src={blog.image} 
          alt={blog.title} 
          className="w-full h-48 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; // prevent infinite loop
              target.src = "https://placehold.co/600x400/0a0f1f/e5e7eb?text=Image+Not+Found";
          }}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3
          className={isLight ? "text-xl font-bold mb-3 font-heading" : "text-xl font-bold mb-3 font-heading"}
          style={!isLight ? { color: '#D0FF5F' } : {}}
        >{blog.title}</h3>
        <p className={isLight ? "text-sm text-[#302A36] mb-2" : "text-sm text-text-muted mb-2"}>{formatDate(blog.date)}</p>
        <div 
          className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'animate-fade-in-down' : 'max-h-0'}`}
        >
          <div className={isLight ? "prose prose-sm text-[#302A36] max-w-none pb-4" : "prose prose-invert prose-sm text-body-text/80 max-w-none pb-4"}>
            <p>{blog.content}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={isLight ? "mt-4 w-full rounded-lg px-4 py-2.5 font-bold text-[#302A36] bg-gradient-to-r from-[#FEF8E8] to-[#e6e0d0] border border-[#302A36]/20 transition-all duration-300 ease-in-out hover:brightness-110 hover:shadow-lg hover:shadow-[#302A36]/20 focus:outline-none focus:ring-2 focus:ring-[#302A36] focus:ring-opacity-50" : "mt-4 w-full rounded-lg px-4 py-2.5 font-bold text-primary-dark bg-gradient-to-r from-charcoal to-section-heading transition-all duration-300 ease-in-out hover:brightness-110 hover:shadow-lg hover:shadow-section-heading/20 focus:outline-none focus:ring-2 focus:ring-section-heading focus:ring-opacity-50"}
        >
          <span className="flex items-center justify-center space-x-2">
            <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
            <ChevronRight size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
          </span>
        </button>
      </div>
    </div>
  );
};

// --- Main Section Component ---

const BlogSection: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";
  const handleToggle = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };
  return (
    <section className={isLight ? "py-16 sm:py-24 bg-[#FEF8E8]" : "py-16 sm:py-24"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className={isLight ? "text-3xl text-bold text-[#302A36] sm:text-4xl font-heading" : "text-3xl text-bold sm:text-4xl font-heading"}
            style={!isLight ? { color: '#D0FF5F' } : {}}
          >
            Latest News & Updates
          </h2>
          <p className={isLight ? "mt-4 text-lg text-[#302A36]" : "mt-4 text-lg text-[#FEF8E8]"}>
            Stay informed with the latest developments from the Qubic team.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(blogsData as Blog[]).map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              isExpanded={expandedId === blog.id}
              onToggle={() => handleToggle(blog.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
