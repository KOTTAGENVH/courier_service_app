"use client"
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login } from "./api/services/auth/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BgBlurLoader from "@/components/bgBlurLoader";
import { useDispatch } from "react-redux";
import { setUserDetails } from "@/global_redux/feature/userSlice";

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required'),
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const initialValues = {
    email: '',
    password: '',
    remember: false,
  };

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      setIsLoading(true);
      const response = await login(values.email, values.password);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch(setUserDetails((response as any)?.data?.user));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof response === "object" && response !== null && "status" in response && (response as any).status === 200) {
        // Handle successful login
        router.push('/home');
        setIsLoading(false);
        setSubmitting(false);
      } else {
        // Handle login error
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMsg = typeof response === "string" ? response : (response as any)?.data || "Unknown error";
        console.error('Login failed:', errorMsg);
        alert('Login failed. Please check your credentials and try again.');
        setSubmitting(false);
        setIsLoading(false);
      }
    } catch {
      alert('An error occurred. Please try again later.');
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen dark:bg-[#525252] dark:bg-[linear-gradient(to_right,_#3d72b4,_#525252)] bg-[#8e9eab]   bg-[linear-gradient(to_right,_#eef2f3,_#8e9eab)] overflow-hidden">
      {isLoading && <BgBlurLoader />}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md bg-transparent  backdrop-blur-2xl shadow-2xl  rounded-lg p-8 bg-opacity-80 bg-gray-100">
          <div className="items-center justify-center mb-4 text-center">
            <Image
              src="/courierMeLogo.png"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto mb-4 h-16 w-auto rounded-full shadow-lg"
            />
            <h1 className="text-3xl font-bold dark:text-white text-black">Welcome Back</h1>
            <p className="mt-2 text-sm dark:text-white text-black">
              Courier me your trusted partner for all your delivery needs.
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="mt-6 space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium dark:text-white text-black">
                    Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <EnvelopeIcon
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                    />
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="block w-full pl-10 pr-4 py-3 placeholder-gray-400 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-black"
                    />
                  </div>
                  <ErrorMessage name="email">
                    {msg => <div className="text-sm text-red-600 mt-1">{msg}</div>}
                  </ErrorMessage>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium dark:text-white text-black">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <LockClosedIcon
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                    />
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Password"
                      className="block w-full pl-10 pr-4 py-3 placeholder-gray-400 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-black"
                    />
                  </div>
                  <ErrorMessage name="password">
                    {msg => <div className="text-sm text-red-600 mt-1">{msg}</div>}
                  </ErrorMessage>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                        <button
          type="button"                     
           onClick={() => {
                    router.push('/forget-password');
                  }}
          className="font-medium dark:text-white text-black hover:text-orange-600"
        >
          Forgot Password
        </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 rounded-xl shadow-xl text-lg font-medium dark:text-white text-black dark:bg-[#485563] dark:bg-[linear-gradient(to_right,_#29323c,_#485563)]     bg-[#abbaab]        bg-gradient-to-r from-[#ffffff] to-[#abbaab]  hover:bg-none hover:bg-blue-600  cursor-pointer"
                >
                  Submit
                </button>
                <hr />
                <p className="mt-6 text-center text-sm dark:text-white text-black">
                  Don&nbsp;t have account?{' '}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    router.push('/signup');
                  }}
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 rounded-xl shadow-xl text-lg font-medium dark:text-white text-black dark:bg-[#485563] dark:bg-[linear-gradient(to_right,_#29323c,_#485563)]     bg-[#abbaab]        bg-gradient-to-r from-[#ffffff] to-[#abbaab]  hover:bg-none hover:bg-blue-600  cursor-pointer"
                >
                  Sign up
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
