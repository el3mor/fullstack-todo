import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import InputErrorMessage from '../components/ui/InputErrorMessage';
import { LOGIN_FORM } from '../data';
import { useForm, SubmitHandler } from 'react-hook-form';
import { loginSchema } from '../validation';
import { useState } from 'react';
import axiosInstance from '../config/axios.config';
import { AxiosError } from 'axios';
import { IErrorResponse } from '../interfaces';
import toast from 'react-hot-toast';

interface IFormInput {
  identifier: string;
  password: string;
}

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ resolver: yupResolver(loginSchema) });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    try {
      const { status } = await axiosInstance.post('/auth/local', data);
      if (status === 200) {
        toast.success('You will navigate to the home page in 4 seconds');
      }
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errorObj?.response?.data.error.message}`, {
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputs = LOGIN_FORM.map(({ name, placeholder, type, validation }) => {
    return (
      <div key={name} className="w-full">
        <Input placeholder={placeholder} type={type} {...register(name, validation)} />
        {errors[name] && <InputErrorMessage msg={errors[name].message} />}
      </div>
    );
  });

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Login to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderInputs}

        <Button fullWidth isLoading={isLoading}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
