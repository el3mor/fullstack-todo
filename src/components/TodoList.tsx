import Button from './ui/Button';
import { ITodo } from '../interfaces';
import useAuthenticatedQuery from '../hooks/useAuthenticatedQuery';

const TodoList = () => {
  const { isLoading, data, error } = useAuthenticatedQuery({
    queryKey: ['todos'],
    URL: '/users/me?populate=todos',
    config: {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedInUser')!).jwt}`,
      },
    }
  });

  if (isLoading)
    return (
  <div className="flex items-center justify-center w-full h-40">
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className="space-y-1 ">
      {data.todos.length ? (
        data.todos.map((todo: ITodo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between hover:bg-gray-100 duration-200 p-3 rounded-md even:bg-gray-100"
          >
            <p className="w-full font-semibold">{todo.title}</p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button size={'sm'}>Edit</Button>
              <Button variant="danger" size={'sm'}>
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center w-full h-40">
          <p className="text-gray-500">No todos found</p>
        </div>
      )}
      <div className="flex w-fit mx-auto my-10 gap-x-2">
        <Button variant="default" size={'sm'}>
          Post new todo
        </Button>
        <Button variant="outline" size={'sm'}>
          Generate todos
        </Button>
      </div>
    </div>
  );
};

export default TodoList;
