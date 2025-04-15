import { useState } from 'react';
import TodoSkeleton from '../components/TodoSkeleton';
import Paginator from '../components/ui/Paginator';
import useAuthenticatedQuery from '../hooks/useAuthenticatedQuery';

const TodosPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('DESC');

  const { isLoading, data, error, isFetching } = useAuthenticatedQuery({
    queryKey: [`todos-page-${page}`, `${pageSize}`, sortBy],
    URL: `/todos?pagination[pageSize]=${pageSize}&pagination[page]=${page}&sort=createdAt:${sortBy}`,
    config: {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedInUser')!).jwt}`,
      },
    },
  });

  const onClickNext = () => setPage((prev) => prev + 1);
  const onClickPrev = () => setPage((prev) => prev - 1);

  if (isLoading)
    return (
      <div className="max-w-2xl mx-auto space-y-1 mb-20 ">
        {Array.from({ length: 5 }, (_, index) => (
          <TodoSkeleton key={index} />
        ))}
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <div className="max-w-2xl mx-auto space-y-1 mb-20">
        <div className="flex items-center justify-end mb-4 gap-4">
          <select
            className="border border-indigo-600 rounded-md p-2"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option disabled>Page size</option>
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <select
            className="border border-indigo-600 rounded-md p-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option disabled>Sort by</option>
            <option value="ASC">Oldest</option>
            <option value="DESC">Latest</option>
          </select>
        </div>
        {data.data.length ? (
          data.data.map(({ documentId, title }: { documentId: string; title: string }) => (
            <div
              key={documentId}
              className="flex items-center justify-between hover:bg-gray-100 duration-200 p-3 rounded-md even:bg-gray-100"
            >
              <h3 className="w-full font-semibold">{title}</h3>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center w-full h-40">
            <p className="text-gray-500">No todos found</p>
          </div>
        )}

        <Paginator
          page={page}
          pageCount={data.meta.pagination.pageCount}
          total={data.meta.pagination.total}
          isLoading={isLoading || isFetching}
          onClickNext={onClickNext}
          onClickPrev={onClickPrev}
        />
      </div>
    </>
  );
};

export default TodosPage;
