import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useForm, SubmitHandler } from 'react-hook-form';
import InputErrorMessage from '../components/ui/InputErrorMessage';
import { REGISTER_FORM } from '../data';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../validation';
import axiosInstance from '../config/axios.config';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { IErrorResponse } from '../interfaces';

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({resolver:yupResolver(registerSchema)});

  const onSubmit: SubmitHandler<IFormInput> = async(data) => {
    console.log(data);
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/local/register', data);
      console.log(response.data);
      toast.success("You will navigate to the login page in 4 seconds");
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errorObj?.response?.data.error.message}`, {
        duration: 4000,
      
      } )
    } finally {
      setIsLoading(false);
    }
  };


  const renderInputs = REGISTER_FORM.map(({ name, placeholder, type, validation }) => {
    return (
      <div key={name} className="w-full">
        <Input
          placeholder={placeholder}
          type={type}
          {...register(name, validation)}
        />
        {errors[name] && <InputErrorMessage msg={errors[name].message} />}
      </div>
    );
  });
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Register to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderInputs}
        <Button fullWidth isLoading={isLoading}>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
