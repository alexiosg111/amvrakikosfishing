import { getAllReviews, getReviewStats, ReviewFilters } from "@/actions/admin/reviews";
import { ReviewsList } from "@/components/admin/ReviewsList";
import { Pagination } from "@/components/admin/Pagination";
import { AdminCard } from "@/components/admin/AdminCard";
import { Star, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Suspense } from "react";

interface PageProps {
  params: { locale: string };
  searchParams: {
    search?: string;
    isVerified?: string;
    rating?: string;
    page?: string;
  };
}

export default async function ReviewsPage({ params: { locale }, searchParams }: PageProps) {
  const filters: ReviewFilters = {
    search: searchParams.search,
    isVerified:
      searchParams.isVerified === "true"
        ? true
        : searchParams.isVerified === "false"
        ? false
        : undefined,
    rating: searchParams.rating ? parseInt(searchParams.rating) : undefined,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    pageSize: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  const [{ reviews, total, page, pageSize, totalPages }, stats] = await Promise.all([
    getAllReviews(filters),
    getReviewStats(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Reviews</h2>
        <p className="text-muted-foreground">{total} total reviews</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminCard
          title="Total Reviews"
          value={stats.total}
          icon={Star}
          iconClassName="bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400"
        />
        <AdminCard
          title="Verified"
          value={stats.verified}
          icon={CheckCircle}
          iconClassName="bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
        />
        <AdminCard
          title="Pending"
          value={stats.unverified}
          icon={Clock}
          iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
        />
        <AdminCard
          title="Average Rating"
          value={stats.averageRating.toFixed(1)}
          icon={TrendingUp}
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
        />
      </div>

      <ReviewsList reviews={reviews as any} />

      <Suspense>
        <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} />
      </Suspense>
    </div>
  );
}
