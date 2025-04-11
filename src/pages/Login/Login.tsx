'use client'

import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContainer } from '../../components/layout/AuthContainer'
import AuthButton from '../../components/common/auth/AuthButton'
import DividerWithBootstrap from '../../components/common/auth/Divider'
import AuthSwitch from '../../components/common/auth/AuthSwitchProps '
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import Input from 'src/components/common/Input/Input'
import { schema, Schema } from 'src/utils/rules'
import { useMutation } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { AppContext } from 'src/contexts/app.context'

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

export default function LoginPage() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  //Handle login with data from database
  const loginMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.login(body)
  })
  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })


  //Handle login with Google
  async function handleGoogleLogin() {
    try {
      const { google } = window

      const client = google.accounts.oauth2.initTokenClient({
        client_id: '714231235616-eg8j97emftncuiif0o4rsf21o4bdfeso.apps.googleusercontent.com',
        scope: 'profile email',
        callback: async (response: GoogleOAuthResponse) => {
          const idToken = response.access_token

          // Gửi token lên backend để xác thực
          const result = await fetch('/api/auth/google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: idToken })
          })

          if (result.ok) {
            const data = await result.json()
            console.log('Login success:', data)
            localStorage.setItem('authToken', data.token) // Lưu token vào localStorage
          } else {
            console.error('Google Login failed')
          }
        }
      })

      // Hiển thị popup đăng nhập Google
      client.requestAccessToken()
    } catch (error) {
      console.error('Error during Google login:', error)
    }
  }

  //Handle login with Email: Navigate to login-email page
  async function handleEmailLogin() {
    navigate('/login-email')
  }

  return (
    <AuthContainer>
      <div className='card shadow-sm py-4'>
        <div className='card-body p-4'>
          <AuthButton
            onClick={handleGoogleLogin}
            icon={
              <img src='https://www.svgrepo.com/show/303108/google-icon-logo.svg' alt='Google' width='20' height='20' />
            }
            text='Log in with Google'
          />

          <AuthButton
            onClick={handleEmailLogin}
            icon={
              <img
                src='https://icons.veryicon.com/png/o/business/official-icon-library-of-alibaba/email-fill.png'
                alt='Google'
                width='20'
                height='20'
              />
            }
            text='Log in with Email'
          />

          <DividerWithBootstrap />

          <form onSubmit={onSubmit} noValidate>
          <Input
                name='email'
                register={register}
                type='email'
                className='mb-3'
                errorMessage={errors.email?.message}
                placeholder='Email'
              />
              <Input
                name='password'
                register={register}
                type='password'
                className='mb-3'
                errorMessage={errors.password?.message}
                placeholder='Password'
                autoComplete='on'
              />

            <div className='text-end mb-5'>
              <a href='/forgot-password' className='text-decoration-none'>
                Forgot Password?
              </a>
            </div>

            <button type='submit' className='btn btn-primary w-100' disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <AuthSwitch question="Don't have an account?" buttonText='Sign up' targetRoute='/signup' />
        </div>
      </div>
    </AuthContainer>
  )
}
