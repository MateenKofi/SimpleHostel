import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getHostels } from "@/api/hostels";
import { Hostel } from "@/helper/types/types";
import FeaturedHostelCard from "@/components/hostel/FeaturedHostelCard";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FeaturedHostels = () => {
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
  } = useQuery({
    queryKey: ["featured_hostels"],
    queryFn: async () => {
      return await getHostels();
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const hostels = response?.data;

  // Get 2 random hostels
  const randomHostels = React.useMemo(() => {
    if (!hostels || hostels.length === 0) return [];

    const published = hostels.filter(
      (h: Hostel) => h?.state === "published" && h?.rooms?.length > 0
    );

    if (published.length <= 4) return published;

    const randomIndexes = new Set<number>();

    while (randomIndexes.size < 4) {
      const randomIndex = Math.floor(Math.random() * published.length);
      randomIndexes.add(randomIndex);
    }

    return Array.from(randomIndexes).map((index) => published[index]);
  }, [hostels]);

  const handleViewAll = () => {
    navigate("/find-hostel");
  };

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-transparent via-forest-green-50/30 to-transparent">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-teal-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Featured <span className="text-primary">Hostels</span>
          </h2>
          <p className="max-w-2xl text-muted-foreground text-base md:text-lg">
            Discover our carefully selected hostels offering the best comfort, convenience, and value for your stay
          </p>
        </div>

        {/* Hostels Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="aspect-[3/4] rounded-xl overflow-hidden animate-pulse bg-muted relative"
              >
                <div className="absolute inset-0 bg-muted" />
                <div className="absolute inset-0 bg-gradient-to-t from-muted-foreground/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                  <div className="flex justify-between gap-2">
                    <div className="h-5 bg-muted-foreground/20 rounded w-2/3" />
                    <div className="h-6 bg-muted-foreground/20 rounded-full w-10 shrink-0" />
                  </div>
                  <div className="h-4 bg-muted-foreground/20 rounded w-1/2" />
                  <div className="flex gap-2">
                    <div className="h-8 bg-muted-foreground/20 rounded-lg flex-1" />
                    <div className="h-8 bg-muted-foreground/20 rounded-lg flex-[2]" />
                  </div>
                  <div className="flex justify-between items-center gap-3">
                    <div className="space-y-1">
                      <div className="h-3 bg-muted-foreground/20 rounded w-16" />
                      <div className="h-5 bg-muted-foreground/20 rounded w-20" />
                    </div>
                    <div className="h-9 bg-muted-foreground/20 rounded-lg w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : randomHostels.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {randomHostels.map((hostel: Hostel, index: number) => (
                <div key={hostel.id || index} className="w-full">
                  <FeaturedHostelCard hostel={hostel} index={index} />
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="flex justify-center mt-12">
              <Button
                onClick={handleViewAll}
                size="lg"
                className="group bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8"
              >
                View All Hostels
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured hostels available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedHostels;