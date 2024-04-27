"use client"
import { createClient } from "@/lib/supbase/client"
import { Button } from "./ui/button"
import { use, useEffect, useState } from "react"
import { Input } from "./ui/input"
import { InputIcon } from "@radix-ui/react-icons"
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp"

export default function Login() {
	const [user, setUser] = useState<any>({})
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [emailError, setEmailError] = useState(false)
	const [passwordError, setPasswordError] = useState(false)
	const [otp, setOtp] = useState(false)
	const supabase = createClient()
	useEffect(() => {
		const testUser = async () => {
			const { data, error } = await supabase.auth.getUser()
			setUser(data.user)
		}
		testUser()
	}, [])
	const login = async () => {
		const { error, data } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		})
		console.log("User logged in:", user)
		setUser(data.user)
		if (error) {
			console.error("Error logging in:", error.message)
			return
		}
		window.location.reload()
	}
	const signUp = async () => {
		console.log("Signing up")
		const { error, data } = await supabase.auth.signUp({
			email: email,
			password: password,
		})
		if (error) {
			console.error("Error signing up:", error.message)
		}
		await supabase.auth.signOut()
		if (!error) {
			setOtp(true)
		}
	}
	const validateEmail = () => {
		const re = /^[a-zA-Z0-9._%+-]+@delta-studenti\.cz$/
		setEmailError(!re.test(email))
	}
	const validatePassword = () => {
		setPasswordError(password.length < 8)
	}
	const handleOtp = async (value: string) => {
		if (value.length === 6) {
			const {data,error}= await supabase.auth.verifyOtp({
				email: email,
				token: value,
				type: "email",
			})
			if (error) {
				console.error("Error verifying OTP:", error.message)
				return
			}
			setUser(data.user)
			window.location.reload()
		}
	}

	return (
		<>
			{!user && (
				<div className="fixed h-screen w-screen backdrop-blur-md top-0 left-0 flex items-center justify-center">
					<div className=" p-8 border-4 border-neutral-800 rounded-3xl flex flex-col gap-2">
						{!otp && (
							<>
								<p className="w-full text-center">
									You MUST use a @delta-studenti.cz account
								</p>
								<Input
									className={
										emailError ? "border-red-500" : ""
									}
									placeholder="Email"
									type="email"
									onChange={(e) => setEmail(e.target.value)}
									onBlur={() => validateEmail()}
								/>
								<Input
									className={
										passwordError ? "border-red-500" : ""
									}
									placeholder="Password"
									type="password"
									onChange={(e) =>
										setPassword(e.target.value)
									}
									onBlur={() => validatePassword()}
								/>

								{passwordError && (
									<p className="w-full text-center text-xs">
										password must be 8 letter
									</p>
								)}
								<div className="flex justify-between">
									<Button
										className=""
										onClick={login}
										disabled={
											emailError || passwordError
												? true
												: false
										}
									>
										Login
									</Button>
									<Button
										className=""
										onClick={signUp}
										disabled={
											emailError || passwordError
												? true
												: false
										}
									>
										Sign up
									</Button>
								</div>
							</>
						)}
						{otp && (
							<>
							<InputOTP maxLength={6} onChange={(value) => handleOtp(value)}>
								<InputOTPGroup>
									<InputOTPSlot index={0} />
									<InputOTPSlot index={1} />
									<InputOTPSlot index={2} />
								</InputOTPGroup>
								<InputOTPSeparator />
								<InputOTPGroup>
									<InputOTPSlot index={3} />
									<InputOTPSlot index={4} />
									<InputOTPSlot index={5} />
								</InputOTPGroup>
							</InputOTP>
							</>
						)}
					</div>
				</div>
			)}
		</>
	)
}
