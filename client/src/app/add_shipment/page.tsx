/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Drawer from '@/components/drawer';
import Header from '@/components/header';
import { useDrawerContext } from '@/contextApi/drawerState';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { newShipment, ShippingPayload } from '../api/services/shipping/api';
import { RootState } from '@/global_redux/store';
import BgBlurLoader from '@/components/bgBlurLoader';


interface CreateShipmentForm {
  senderAddress: string;
  receiverFirstName: string;
  receiverLastName: string;
  receiverAddress: string;
  receiverTelephone: string;
  weight: number;
  cardName: string;
  cardNumber: string;
  cvc: string;
}

export default function Page() {
  const { status, toggleDrawer } = useDrawerContext();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const userEmail = useSelector((state: RootState) => state.user.email);
  const isLastStep = () => step === validationSchemas.length - 1;
  const ratePerKg = 500;

  const initialValues: CreateShipmentForm = {
    senderAddress: '',
    receiverFirstName: '',
    receiverLastName: '',
    receiverAddress: '',
    receiverTelephone: '',
    weight: 0,
    cardName: '',
    cardNumber: '',
    cvc: '',
  };

  // per‐step validation schemas
  const validationSchemas = [
    Yup.object({

      receiverFirstName: Yup.string().required('First name is required'),
      receiverLastName: Yup.string().required('Last name is required'),
      receiverAddress: Yup.string().required('Receiver address is required'),
    }),
    Yup.object({
      receiverTelephone: Yup.string()
        .required('Telephone is required')
        .test(
          'is-valid-phone',
          'Invalid phone number for selected country',
          value => (value ? isValidPhoneNumber(value) : false)
        ),

      senderAddress: Yup.string().required('Sender address is required'),
      weight: Yup.number().min(0.2, 'Weight must be > 0.2').required('Weight is required'),
    }),
    Yup.object({
      cardName: Yup.string().required('Name on card is required'),
      cardNumber: Yup.string()
        .required('Card number is required')
        .matches(/^[0-9]{16}$/, 'Must be 16 digits'),
      cvc: Yup.string()
        .required('CVC is required')
        .matches(/^[0-9]{3,4}$/, 'Must be 3 or 4 digits'),
    }),
  ];

  const handleNext = async (
    values: CreateShipmentForm,
    actions: FormikHelpers<CreateShipmentForm>
  ) => {
    if (!isLastStep()) {
      // validate current step
      try {
        await validationSchemas[step].validate(values, { abortEarly: false });
        setStep(step + 1);
      } catch (errs: any) {
        const errors = errs.inner.reduce((acc: any, err: any) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
        actions.setErrors(errors);
      }
    } else {
      // final submit
      try {
        setIsLoading(true);
        const payload: ShippingPayload = {
          senderAddress: values.senderAddress,
          receiverFirstName: values.receiverFirstName,
          receiverLastName: values.receiverLastName,
          receiverAddress: values.receiverAddress,
          receiverTelephone: values.receiverTelephone,
          weight: values.weight,
          userEmail: userEmail,
        };
        await newShipment(payload);
        router.push('/shipments');
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        actions.setSubmitting(false);
        alert('Failed to create shipment');
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen dark:bg-[#525252] dark:bg-[linear-gradient(to_right,_#3d72b4,_#525252)] bg-[#8e9eab] bg-[linear-gradient(to_right,_#eef2f3,_#8e9eab)] overflow-hidden">
      <Header />
      <Drawer isOpen={status} toggleDrawerloc={() => toggleDrawer(false)} />
      {isLoading && <BgBlurLoader />}
      <div className="flex flex-1 items-center justify-center p-8 mt-28">
        <div className="w-full max-w-4xl bg-transparent  backdrop-blur-2xl shadow-2xl  rounded-lg p-8 bg-opacity-80 bg-gray-100">
          <h2 className="text-2xl font-bold mb-6 dark:text-white text-black">New Shipment</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[step]}
            onSubmit={handleNext}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="space-y-6">
                {step === 0 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium dark:text-white text-black">Receiver First Name</label>
                      <Field name="receiverFirstName" placeholder="Jane" className="block w-full pl-10 pr-4 py-3 placeholder-gray-400 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-black"
                      />
                      <ErrorMessage name="receiverFirstName" component="div" className="text-red-600 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-white text-black">Receiver Last Name</label>
                      <Field name="receiverLastName" placeholder="Doe" className="block w-full pl-10 pr-4 py-3 placeholder-gray-400 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-black"
                      />
                      <ErrorMessage name="receiverLastName" component="div" className="text-red-600 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-white text-black">Receiver Address</label>
                      <Field as="textarea" rows={4} name="receiverAddress" placeholder="456 Elm St" className="block w-full pl-10 pr-4 py-3 placeholder-gray-400 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-black"
                      />
                      <ErrorMessage name="receiverAddress" component="div" className="text-red-600 text-sm" />
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium dark:text-white text-black">Contact no.</label>
                      <PhoneInput
                        international
                        defaultCountry="LK"
                        value={values.receiverTelephone}
                        onChange={(val) => setFieldValue('receiverTelephone', val || '')}
                        className="block w-full pl-10 pr-4 py-3 placeholder-gray-400 \
             bg-gray-100 rounded-md focus:outline-none \
             focus:ring-2 focus:ring-indigo-500 focus:bg-white text-black"
                      />
                      <ErrorMessage name="receiverTelephone" component="div" className="text-red-600 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-white text-black">Sender Address</label>
                      <Field as="textarea" rows={4} name="senderAddress" placeholder="123 Main St" className="block w-full pl-10 pr-4 py-3 placeholder-gray-400 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-black"
                      />
                      <ErrorMessage name="senderAddress" component="div" className="text-red-600 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-white text-black">Weight (kg)</label>
                      <Field name="weight" type="number" placeholder="0.0" className="block w-full pl-10 pr-4 py-3 placeholder-gray-400 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-black"
                      />
                      <ErrorMessage name="weight" component="div" className="text-red-600 text-sm" />
                    </div>
                  </>
                )}
                {step === 2 && (
                  <div className="flex flex-row flex-wrap items-start space-x-6">
                    <Image
                      src="/card.jpg"
                      alt="Credit card illustration"
                      width={128}
                      height={80}
                      className="w-32 h-auto rounded-lg shadow m-2"
                    />
                    <div className="flex-1 space-y-4">
                      <div className="mb-2">
                        <span className="text-lg font-medium">
                          Total:&nbsp;
                          <strong>{(values.weight * ratePerKg).toFixed(2)} LKR</strong>
                        </span>
                      </div>

                      <div>
                        <label className="block text-sm font-medium dark:text-white text-black">
                          Name on Card
                        </label>
                        <Field
                          name="cardName"
                          placeholder="Jane Doe"
                          className="block w-full pl-10 pr-4 py-3 placeholder-gray-400 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-black"
                        />
                        <ErrorMessage
                          name="cardName"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium dark:text-white text-black">
                          Card Number
                        </label>
                        <Field
                          name="cardNumber"
                          placeholder="1234 1234 1234 1234"
                          className="block w-full pl-10 pr-4 py-3 placeholder-gray-400 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-black"
                        />
                        <ErrorMessage
                          name="cardNumber"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium dark:text-white text-black">
                          CVC
                        </label>
                        <Field
                          name="cvc"
                          placeholder="123"
                          className="block w-32 pl-10 pr-4 py-3 placeholder-gray-400 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-black"
                        />
                        <ErrorMessage
                          name="cvc"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}


                <div className="flex justify-between">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="w-24 md:w-32 h-10 rounded-xl shadow-xl text-lg font-medium dark:text-white text-black dark:bg-[#485563] dark:bg-[linear-gradient(to_right,_#29323c,_#485563)]     bg-[#abbaab]        bg-gradient-to-r from-[#ffffff] to-[#abbaab] hover:bg-gray-300  cursor-pointer  hover:bg-none hover:bg-blue-600"
                    >
                      Back
                    </button>
                  ) : <div />}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-24 md:w-32 h-10 rounded-xl shadow-xl text-lg font-medium dark:text-white text-black dark:bg-[#485563] dark:bg-[linear-gradient(to_right,_#29323c,_#485563)]     bg-[#abbaab]        bg-gradient-to-r from-[#ffffff] to-[#abbaab] hover:bg-gray-300  cursor-pointer  hover:bg-none hover:bg-blue-600"
                  >
                    {isLastStep() ? 'Pay' : 'Next'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
