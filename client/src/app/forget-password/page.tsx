"use client"
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from "next/navigation";
import { useState } from "react";
import BgBlurLoader from "@/components/bgBlurLoader";
import { forgetPassword } from "../api/services/auth/api";


// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const initialValues = {
    email: '',
    password: '',
    remember: false,
  };

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      setIsLoading(true);
      const response = await forgetPassword(values.email);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        alert(response?.message);
        setIsLoading(false);
        setSubmitting(false);
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
            <h1 className="text-3xl font-bold dark:text-white text-black">Enter your email</h1>
            <p className="mt-2 text-sm dark:text-white text-black">
              A reset link would be sent to your email address.
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
                    router.push('/');
                  }}
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 rounded-xl shadow-xl text-lg font-medium dark:text-white text-black dark:bg-[#485563] dark:bg-[linear-gradient(to_right,_#29323c,_#485563)]     bg-[#abbaab]        bg-gradient-to-r from-[#ffffff] to-[#abbaab]  hover:bg-none hover:bg-blue-600  cursor-pointer"
                >
                  Sign in
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
