import { getAllUsers, UserFilters } from "@/actions/admin/users";
import { UsersList } from "@/components/admin/UsersList";
import { Pagination } from "@/components/admin/Pagination";
import { Suspense } from "react";

interface PageProps {
  params: { locale: string };
  searchParams: {
    search?: string;
    page?: string;
  };
}

export default async function UsersPage({ params: { locale }, searchParams }: PageProps) {
  const filters: UserFilters = {
    search: searchParams.search,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    pageSize: 20,
  };

  const { users, total, page, pageSize, totalPages } = await getAllUsers(filters);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Customers</h2>
        <p className="text-muted-foreground">{total} registered customers</p>
      </div>

      <UsersList users={users} />

      <Suspense>
        <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} />
      </Suspense>
    </div>
  );
}
