// forntend/src/components/Register.jsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRegisterUserMutation } from '../../redux/services/authApi'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Logo from '../ui/Logo'


const Register = ({ switchToLogin }) => {
    const [registerUser, { isLoading }] = useRegisterUserMutation()
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        setApiError("");
        setSuccess("")
        try {
            await registerUser(data).unwrap();
            setSuccess("Account created successfully! You can now login.")
        } catch (error) {
            setApiError(error?.data?.message || "Registration failed!")
        }
    }


    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white border border-gray-200 shadow-sm text-center">
            <Logo size="lg" className="mb-2 inline-block" />
            <h2 className="text-sm font-bold mb-6 uppercase tracking-wider text-gray-700">
                Create Your Account
            </h2>



            {apiError && <div className='mb-4 text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded border border-red-200'>{apiError}</div>}
            {success && <div className='mb-4 text-xs font-semibold text-green-600 bg-green-50 p-2.5 rounded border border-green-200'>{success}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 text-left'>
                <div>
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        type="text"
                        {...register("fullName", {
                            required: "Full name is required"
                        })}
                        error={errors.fullName?.message}
                    />



                    {/* <input
                        label="Full Name"
                        placeholder='John Doe'
                        type='text'
                        {...register("fullName", {
                            required: "Full name is required"
                        })}
                        error={errors.fullName?.message}
                    /> */}

                    {/* <Input
                        label="Username"
                        type="text"
                        placeholder="johndoe"
                        {...register("Username", {
                            required: "Username is required"
                        })}
                        error={errors.username?.message}
                    /> */}

                    <Input
                        label="Username"
                        type="text"
                        placeholder="johndoe"
                        {...register("username", {
                            required: "Username is required"
                        })}
                        error={errors.username?.message}
                    />


                    <Input
                        type="email"
                        label="Email"
                        placeholder="john@example.com"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address',
                            }
                        })}
                        error={errors.email?.message}
                    />

                    {/* <Input
                        label="Password"
                        type="password"
                        placeholder="********"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least c characters" },
                        })}
                        error={errors.password?.message}
                    /> */}

                    <Input
                        label="Password"
                        type="password"
                        placeholder="********"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                            }
                        })}
                        error={errors.password?.message}
                    />


                    <Button type='submit' isLoading={isLoading} className='mt-2' >
                        Create Account
                    </Button>
                </div>
            </form>

            <p className='mt-6 text-center text-xs text-gray-600'>
                Already have an account?{""}
                <button onClick={switchToLogin} className='underline font-bold hover:text-black'>
                    Login
                </button>
            </p>


        </div>
    )
}

export default Register
