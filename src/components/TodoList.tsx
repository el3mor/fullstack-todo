import Button from './ui/Button';
import { ITodo } from '../interfaces';
import useAuthenticatedQuery from '../hooks/useAuthenticatedQuery';
import Modal from './ui/Modal';
import { useState } from 'react';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import { SubmitHandler, useForm } from 'react-hook-form';
import { todoSchema } from '../validation';
import { yupResolver } from '@hookform/resolvers/yup';
import InputErrorMessage from './ui/InputErrorMessage';
import axiosInstance from '../config/axios.config';
import toast from 'react-hot-toast';
import TodoSkeleton from './TodoSkeleton';
import { faker } from '@faker-js/faker';

interface TodoFormData {
  title: string;
  description: string;
}

const TodoList = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormData>({
    resolver: yupResolver(todoSchema),
  });
  const [todoDocumentId, setTodoDocumentId] = useState<string>('');
  const [refetch, setRefetch] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { isLoading, data, error } = useAuthenticatedQuery({
    queryKey: ['todos', refetch],
    URL: '/users/me?populate=todos',
    config: {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedInUser')!).jwt}`,
      },
    },
  });

  const onCloseAddModal = () => {
    reset({
      title: '',
      description: '',
    });
    setIsAddModalOpen(false);
  };
  const onOpenAddModal = () => {
    setIsAddModalOpen(true);
  };
  const onCloseEditModal = () => {
    reset({
      title: '',
      description: '',
    });
    setIsEditModalOpen(false);
  };
  const onOpenEditModal = (todo: ITodo) => {
    setTodoDocumentId(todo.documentId);
    reset({
      title: todo.title,
      description: todo.description,
    });
    setIsEditModalOpen(true);
  };
  const onCloseRemoveModal = () => {
    setIsRemoveModalOpen(false);
  };
  const onOpenRemoveModal = (todo: ITodo) => {
    setTodoDocumentId(todo.documentId);
    setIsRemoveModalOpen(true);
  };
  const generateFakeTodos = async () => {
    for (let i = 0; i < 100; i++) {
      try {
        const { status } = await axiosInstance.post(
          '/todos',
          {
            data: {
              title: faker.lorem.sentence(),
              description: faker.lorem.paragraph(),
              user: [`${JSON.parse(localStorage.getItem('loggedInUser')!).user.id}`],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedInUser')!).jwt}`,
            },
          },
        );
        if (status === 201) {
          setRefetch(new Date().toString());
        }
      } catch (error) {
        console.log(error);
      }
      
    }
  }
  const addHandler: SubmitHandler<TodoFormData> = async (data) => {
    setIsUpdating(true);
    try {
      const { status } = await axiosInstance.post(
        '/todos',
        {
          data: {
            title: data.title,
            description: data.description,
            user: [`${JSON.parse(localStorage.getItem('loggedInUser')!).user.id}`],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedInUser')!).jwt}`,
          },
        },
      );
      if (status === 201) {
        toast.success('Todo added successfully');
        onCloseAddModal();
        setRefetch(new Date().toString());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };
  const editHandler: SubmitHandler<TodoFormData> = async (data) => {
    setIsUpdating(true);
    try {
      const { status } = await axiosInstance.put(
        `/todos/${todoDocumentId}`,
        {
          data: {
            title: data.title,
            description: data.description,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedInUser')!).jwt}`,
          },
        },
      );
      if (status === 200) {
        toast.success('Todo updated successfully');
        onCloseEditModal();
        setRefetch(new Date().toString());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };
  const removeHandler = async () => {
    setIsUpdating(true);
    try {
      const { status } = await axiosInstance.delete(`/todos/${todoDocumentId}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedInUser')!).jwt}`,
        },
      });
      if (status === 204) {
        toast.success('Todo removed successfully');
        onCloseRemoveModal();
        setRefetch(new Date().toString());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading)
    return (
      <div className="space-y-3 ">
        {Array.from({ length: 5 }, (_, index) => (
          <TodoSkeleton key={index} />
        ))}
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className="space-y-1 ">
      <div className="flex w-fit mx-auto my-10 gap-x-2">
        <Button variant="default" size={'sm'} onClick={onOpenAddModal}>
          Post new todo
        </Button>
        <Button variant="outline" size={'sm'} onClick={generateFakeTodos}>
          Generate todos
        </Button>
      </div>
      {data.todos.length ? (
        data.todos.map((todo: ITodo) => (
          <div
            key={todo.documentId}
            className="flex items-center justify-between hover:bg-gray-100 duration-200 p-3 rounded-md even:bg-gray-100"
          >
            <p className="w-full font-semibold">{todo.title}</p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button size={'sm'} onClick={() => onOpenEditModal(todo)}>
                Edit
              </Button>
              <Button variant="danger" size={'sm'} onClick={() => onOpenRemoveModal(todo)}>
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
      
      {/* Add Todo Model */}
      <Modal
        isOpen={isAddModalOpen}
        closeModal={onCloseAddModal}
        title="Add a new Todo"
        description="Add your todo here"
      >
        <form className="flex  mt-2 gap-5 flex-col" onSubmit={handleSubmit(addHandler)}>
          <div>
            <Input {...register('title')} placeholder="Type todo title here..." />
            {errors.title && <InputErrorMessage msg={errors.title.message} />}
          </div>
          <div>
            <Textarea {...register('description')} placeholder="Type todo Description here..." />
            {errors.description && <InputErrorMessage msg={errors.description.message} />}
          </div>
          <div className="flex items-center  w-full space-x-3">
            <Button variant="default" size={'sm'} type="submit" isLoading={isUpdating}>
              Add
            </Button>
            <Button variant="cancel" size={'sm'} onClick={onCloseAddModal} type="button">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      {/* Edit Todo Model */}
      <Modal
        isOpen={isEditModalOpen}
        closeModal={onCloseEditModal}
        title="Edit Todo"
        description="Edit your todo here"
      >
        <form className="flex  mt-2 gap-5 flex-col" onSubmit={handleSubmit(editHandler)}>
          <div>
            <Input {...register('title')} />
            {errors.title && <InputErrorMessage msg={errors.title.message} />}
          </div>
          <div>
            <Textarea {...register('description')} />
            {errors.description && <InputErrorMessage msg={errors.description.message} />}
          </div>
          <div className="flex items-center  w-full space-x-3">
            <Button variant="default" size={'sm'} type="submit" isLoading={isUpdating}>
              Edit
            </Button>
            <Button variant="cancel" size={'sm'} onClick={onCloseEditModal} type="button">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      {/* Remove Todo Model */}
      <Modal
        isOpen={isRemoveModalOpen}
        closeModal={onCloseRemoveModal}
        title="Are you sure you want to remove this todo from your Store?"
        description="Deleting this Todo will remove it permanently from your inventory. Please confirm that you want to proceed with this action."
      >
        <div className="flex items-center justify-end w-full space-x-3 mt-5">
          <Button
            variant="danger"
            size={'sm'}
            type="submit"
            onClick={removeHandler}
            isLoading={isUpdating}
          >
            Yes, remove
          </Button>
          <Button variant="cancel" size={'sm'} onClick={onCloseRemoveModal} type="button">
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
