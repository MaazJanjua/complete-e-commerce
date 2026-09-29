// forntend/src/components/Login.jsx
import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom';

import { useLoginUserMutation } from '../../redux/services/authApi';
import { useForm } from 'react-hook-form'
import Logo from '../ui/Logo';
import Input from '../ui/Input';
import Button from '../ui/Button';

const Login = ({ switchToRegister }) => {

    const navigate = useNavigate();

    const [loginUser, { isLoading }] = useLoginUserMutation()
    const [apiError, setApiError] = useState('');

    const [apiSuccess, setApiSuccess] = useState('')

    const { register, handleSubmit, formState: { errors } } = useForm()
    // const onSubmit = async (data) => {
    //         console.log("LOGIN SUBMITTED:", data);

    //     setApiError('');
    //     try {
    //         await loginUser(data).unwrap();
    //     } catch (error) {
    //         setApiError(error?.data?.message || "Invalid credentilas")
    //     }
    // }

    const onSubmit = async (data) => {
        // console.log("1️⃣ LOGIN SUBMITTED:", data);

        setApiError("");
        setApiSuccess("")

        try {
            // console.log("2️⃣ CALLING LOGIN API...");

            const response = await loginUser(data).unwrap();

            // console.log("3️⃣ LOGIN SUCCESS:", response);
            // Show success popup
            // alert("Login successful! 🎉");
           // Show success message
            setApiSuccess("Login Successful! 🎉"); 
            // Navigate to Home after 1.5 seconds 
           setTimeout(() => { navigate("/"); }, 1500);

        } catch (error) {

            // console.log("4️⃣ LOGIN ERROR:", error);

            setApiError(
                error?.data?.message || "Invalid credentials"
            );
        }
    };



    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white border border-gray-200 shadow-sm text-center">
            <Logo size="lg" className="mb-4 inline-block" />
            <h2 className='text-lg font-bold mb-6 uppercase tracking-wider text-gray-700'>
                Sign In to Your Account
            </h2>

            {apiError && <div className='mb-4 text-sm text-red-600'>{apiError}</div>}
            {apiSuccess && <div className='mb-4 text-xs font-semibold text-green-600 bg-green-50 p-2.5 rounded border border-green-200'>{apiSuccess}</div>}
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 text-left'>
                <Input
                    label='Enter Your Email'
                    type="text"
                    {...register("email", {
                        required: "email or Username is requred"
                    })}
                    error={errors.email?.message}
                />

                <Input

                    label="Enter your password"
                    type="password"
                    {...register("password", {
                        required: "password is required"
                    })}
                    error={errors.password?.message}
                />
                <Button type="submit" isLoading={isLoading} >
                    Sign In
                </Button>

            </form>

            <p className='mt-4 text-center text-xs text-gray-600'>Dont have an account?{""}
                <button onClick={switchToRegister} className='underline font-bold'>Register</button>
            </p>

        </div>
    )

}

export default Login
