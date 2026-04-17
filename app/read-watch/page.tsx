"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Leaf, BookOpen, Video } from "lucide-react";

interface ReadWatch {
  id: string;
  title: string;
  description: string | null;
  category: string;
  content: string | null;
  fileUrl: string | null;
  imageUrl: string | null;
}

const CATEGORIES = ["All", "Tutorial", "Guide", "Research", "Video", "Article"];

const CATEGORY_LABELS: Record<string, string> = {
  All: "All",
  Tutorial: "Tutorial",
  Guide: "Guide",
  Research: "Research",
  Video: "Video",
  Article: "Article",
};

export default function ReadWatchPage() {
  const [items, setItems] = useState<ReadWatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedReadId, setExpandedReadId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, [selectedCategory]);

  const fetchItems = async () => {
    try {
      const url = `/api/read-watch${selectedCategory !== "All" ? `?category=${selectedCategory}` : ""}`;
      const response = await fetch(url, { cache: "no-store" });
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Video":
        return <Video className="w-5 h-5" />;
      case "Tutorial":
      case "Guide":
        return <BookOpen className="w-5 h-5" />;
      default:
        return <Leaf className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 flex-col gap-3 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-700 sm:h-6 sm:w-6" />
              <span className="hidden text-xl font-bold text-green-700 sm:inline">
                laboratory of plant systematic
              </span>
              <span className="text-sm font-bold text-green-700 sm:hidden">
                lab of plant systematic
              </span>
            </Link>

            <div className="hidden items-center gap-4 md:flex">
              <Link
                href="/"
                className="text-gray-600 transition hover:text-green-700"
              >
                Home
              </Link>
              <Link
                href="/people"
                className="text-gray-600 transition hover:text-green-700"
              >
                Team
              </Link>
              <Link href="/read-watch" className="font-medium text-green-700">
                Read and Watch
              </Link>
              <Link href="/dashboard">
                <Button className="bg-green-700 hover:bg-green-800">
                  Dashboard
                </Button>
              </Link>
            </div>

            <div className="flex w-full gap-2 md:hidden">
              <Link href="/" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Home
                </Button>
              </Link>
              <Link href="/dashboard" className="flex-1">
                <Button
                  size="sm"
                  className="w-full bg-green-700 hover:bg-green-800"
                >
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Learning Resources
            </h1>
            <p className="text-base text-gray-600 sm:text-lg">
              Explore tutorials, guides, and educational content to improve your
              research skills.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">
              Latest Announcements
            </h2>
            <p className="text-sm text-gray-600">
              This section automatically follows updates created by assistants
              in the Read and Watch management page.
            </p>
            {loading ? (
              <div className="text-center py-8 text-gray-600">
                Loading announcements...
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white border border-green-200 rounded-lg p-5 text-sm text-gray-600">
                No announcements yet. Assistants can add content from the Read
                and Watch management menu.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {items.slice(0, 3).map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-lg border border-green-200 bg-white"
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="aspect-[4/3] w-full object-cover object-center"
                        loading="lazy"
                      />
                    )}
                    <div className="p-5">
                      <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                        {item.category}
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 mt-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                        {item.description ||
                          "New announcement from the assistant team."}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Search and Filter */}
          <div className="space-y-6">
            <div className="relative">
              <Input
                placeholder="Search learning resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Tabs */}
            <Tabs defaultValue="All" onValueChange={setSelectedCategory}>
              <TabsList className="w-full justify-start overflow-x-auto border border-green-200 bg-white">
                {CATEGORIES.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="shrink-0"
                  >
                    {CATEGORY_LABELS[category] || category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {CATEGORIES.map((category) => (
                <TabsContent
                  key={category}
                  value={category}
                  className="space-y-6 mt-6"
                >
                  {loading ? (
                    <div className="text-center py-12 text-gray-600">
                      Loading learning resources...
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">
                        No learning resources found
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredItems.map((item) => (
                        <Card
                          key={item.id}
                          className="overflow-hidden border-green-200 transition hover:shadow-lg"
                        >
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="aspect-[4/3] w-full object-cover object-center"
                              loading="lazy"
                            />
                          )}
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <CardTitle className="text-lg">
                                  {item.title}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1 mt-1">
                                  <span className="text-green-700">
                                    {getCategoryIcon(item.category)}
                                  </span>
                                  {CATEGORY_LABELS[item.category] ||
                                    item.category}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {item.description && (
                              <p className="text-sm text-gray-600 line-clamp-3">
                                {item.description}
                              </p>
                            )}
                            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                              {item.content && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-green-700 text-green-700 hover:bg-green-50 flex-1"
                                  onClick={() =>
                                    setExpandedReadId((prev) =>
                                      prev === item.id ? null : item.id,
                                    )
                                  }
                                >
                                  {expandedReadId === item.id ? "Hide" : "Read"}
                                </Button>
                              )}
                              {item.fileUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-green-700 text-green-700 hover:bg-green-50 flex-1"
                                  asChild
                                >
                                  <a
                                    href={item.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Download
                                  </a>
                                </Button>
                              )}
                            </div>
                            {expandedReadId === item.id && item.content && (
                              <div className="rounded-md border border-green-100 bg-green-50/40 p-3">
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                                  {item.content}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
