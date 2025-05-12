"use client"
import { EnvelopeIcon, HomeIcon, LockClosedIcon, PhoneIcon, UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { signup } from "../api/services/auth/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BgBlurLoader from "@/components/bgBlurLoader";
import { useDispatch } from "react-redux";
import { setUserDetails } from "@/global_redux/feature/userSlice";
import axios from "axios";

// Validation schema using Yup
const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    address: Yup.string().required("Address is required"),
    telephone: Yup.string()
        .matches(/^[0-9]{10,15}$/, "Telephone must be 10–15 digits")
        .required("Telephone is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Must contain one uppercase letter")
        .matches(/\d/, "Must contain one number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must contain one special character")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
});

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const initialValues = {
        firstName: "",
        lastName: "",
        address: "",
        telephone: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    const handleSubmit = async (
        values: typeof initialValues,
        { setSubmitting }: { setSubmitting: (b: boolean) => void }
    ) => {
        try {
            setIsLoading(true);
            const res = await signup(values);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dispatch(setUserDetails((res as any)?.data?.user));
            if (res.success) {
                router.push("/home");
            } else {
                alert(res.message);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data = err.response.data as Record<string, any>;
                const msg = data.error ?? data.message ?? 'Something went wrong. Please try again.';
                console.log('signup error:', msg);
                alert(msg);
            } else {
                console.log('unexpected error', err);
                alert('Something went wrong. Please try again.');
            }
        } finally {
            setSubmitting(false);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen dark:bg-[#525252] dark:bg-[linear-gradient(to_right,_#3d72b4,_#525252)] bg-[#8e9eab]   bg-[linear-gradient(to_right,_#eef2f3,_#8e9eab)] overflow-hidden">
            {isLoading && <BgBlurLoader />}
            <div className="flex flex-1 items-center justify-center p-8">
                <div className="w-full max-w-md bg-transparent  backdrop-blur-2xl shadow-2xl  rounded-lg p-8 bg-opacity-80 ">
                    <div className="items-center justify-center mb-4 text-center">
                        <Image
                            src="/courierMeLogo.png"
                            alt="Logo"
                            width={100}
                            height={100}
                            className="mx-auto mb-4 h-16 w-auto rounded-full shadow-lg"
                        />
                        <h1 className="text-3xl font-bold dark:text-white text-black">Create your account</h1>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium dark:text-gray-200">
                                        First Name
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Field
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            placeholder="Jane"
                                            className="block w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 dark:bg-gray-600 text-black dark:text-white focus:outline-none focus:ring"
                                        />
                                    </div>
                                    <ErrorMessage name="firstName">
                                        {msg => <div className="text-red-600 text-sm mt-1">{msg}</div>}
                                    </ErrorMessage>
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium dark:text-gray-200">
                                        Last Name
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Field
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            placeholder="Doe"
                                            className="block w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 dark:bg-gray-600 text-black dark:text-white focus:outline-none focus:ring"
                                        />
                                    </div>
                                    <ErrorMessage name="lastName">
                                        {msg => <div className="text-red-600 text-sm mt-1">{msg}</div>}
                                    </ErrorMessage>
                                </div>
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium dark:text-gray-200">
                                        Address
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <HomeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Field
                                            id="address"
                                            name="address"
                                            type="text"
                                            placeholder="123 Main St"
                                            className="block w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 dark:bg-gray-600 text-black dark:text-white focus:outline-none focus:ring"
                                        />
                                    </div>
                                    <ErrorMessage name="address">
                                        {msg => <div className="text-red-600 text-sm mt-1">{msg}</div>}
                                    </ErrorMessage>
                                </div>
                                <div>
                                    <label htmlFor="telephone" className="block text-sm font-medium dark:text-gray-200">
                                        Telephone
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Field
                                            id="telephone"
                                            name="telephone"
                                            type="text"
                                            placeholder="0712345678"
                                            className="block w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 dark:bg-gray-600 text-black dark:text-white focus:outline-none focus:ring"
                                        />
                                    </div>
                                    <ErrorMessage name="telephone">
                                        {msg => <div className="text-red-600 text-sm mt-1">{msg}</div>}
                                    </ErrorMessage>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium dark:text-gray-200">
                                        Email
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Field
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            className="block w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 dark:bg-gray-600 text-black dark:text-white focus:outline-none focus:ring"
                                        />
                                    </div>
                                    <ErrorMessage name="email">
                                        {msg => <div className="text-red-600 text-sm mt-1">{msg}</div>}
                                    </ErrorMessage>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium dark:text-gray-200">
                                        Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Field
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="block w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 dark:bg-gray-600 text-black dark:text-white focus:outline-none focus:ring"
                                        />
                                    </div>
                                    <ErrorMessage name="password">
                                        {msg => <div className="text-red-600 text-sm mt-1">{msg}</div>}
                                    </ErrorMessage>
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium dark:text-gray-200">
                                        Confirm Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Field
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            className="block w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 dark:bg-gray-600 text-black dark:text-white focus:outline-none focus:ring"
                                        />
                                    </div>
                                    <ErrorMessage name="confirmPassword">
                                        {msg => <div className="text-red-600 text-sm mt-1">{msg}</div>}
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
                                    Have account?{' '}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        router.push('/');
                                    }}
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center py-3 px-4 rounded-xl shadow-xl text-lg font-medium dark:text-white text-black dark:bg-[#485563] dark:bg-[linear-gradient(to_right,_#29323c,_#485563)]     bg-[#abbaab]        bg-gradient-to-r from-[#ffffff] to-[#abbaab]  hover:bg-none hover:bg-blue-600  cursor-pointer"
                                >
                                    Sign In
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}
