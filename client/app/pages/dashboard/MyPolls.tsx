import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  BarChart2,
  Copy,
} from "lucide-react";
import { motion } from "motion/react";
import { getMyPolls, ApiPoll } from "../../services/pollService";
import { toast } from "sonner";

export default function MyPolls() {
  const [search, setSearch] = useState("");
  const [polls, setPolls] = useState<ApiPoll[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const fetchPolls = async () => {
  //     try {
  //       const response = await getMyPolls();
  //       if (response.data && response.data.polls) {
  //         setPolls(response.data.polls);
  //       }
  //     } catch (error: any) {
  //       toast.error(

  //         error.message || "Failed to fetch polls"

  //       });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchPolls();
  // }, [toast]);

  useEffect(() => {
    const fetchPolls = async () => {
      setIsLoading(true);
      try {
        const result = await getMyPolls();
        setPolls(result.polls || []);
      } catch (error: any) {
        console.error("Error fetching polls:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch polls. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchPolls();
  }, [toast]);

  const filteredPolls = polls.filter((poll) =>
    poll.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Polls</h2>
          <p className="text-muted-foreground">
            Manage and track all your polls in one place.
          </p>
        </div>
        <Button asChild>
          <Link to="/app/polls/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Poll
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search polls..."
            className="pl-9 bg-card glass"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="glass w-full sm:w-auto">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full py-8 text-center text-muted-foreground">
            Loading polls...
          </div>
        ) : (
          filteredPolls.map((poll, i) => {
            const isExpired =
              poll.expiresAt && new Date(poll.expiresAt) < new Date();
            const status = isExpired ? "Closed" : "Active";
            return (
              <motion.div
                key={poll._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="glass h-full flex flex-col hover:border-primary/50 transition-colors group">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <Badge
                        variant={
                          status === "Active"
                            ? "success"
                            : status === "Closed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 -mr-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    <Link
                      to={`/app/polls/${poll._id}`}
                      className="hover:text-primary transition-colors"
                    >
                      <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">
                        {poll.title}
                      </h3>
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      Created{" "}
                      {new Date(
                        poll.createdAt || Date.now(),
                      ).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <BarChart2 className="w-4 h-4 text-primary" />
                      {(poll as any).totalResponses || 0} responses
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-primary"
                        title="Analytics"
                      >
                        <Link to={`/app/polls/${poll._id}/analytics`}>
                          <BarChart2 className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-primary"
                        title="Copy Link"
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            `${window.location.origin}/app/polls/${poll._id}`,
                          );
                          toast.success("Link copied to clipboard!");
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {!isLoading && filteredPolls.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No polls found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}
