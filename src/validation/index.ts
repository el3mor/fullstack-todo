import * as yup from 'yup';

export const registerSchema = yup.object({
  username: yup.string().min(5,"Username must be at least 5 characters").required('Username is required'),
  email: yup.string().matches(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email").required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
})

export const loginSchema = yup.object({
  identifier: yup.string().required('Email is required'),
  password: yup.string().required('Password is required'),
})
