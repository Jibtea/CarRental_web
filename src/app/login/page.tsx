"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        console.log({ email, password }); // Log input data

        if (!email || !password) {
            alert("Email and password are required!");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/RentalC01/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login successful.");
                router.push("/"); // Redirect to dashboard or home page after login
            } else {
                alert("Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("Login failed. Please try again.");
        }
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black font-serif p-6 leading-relaxed tracking-wider">
            <div className="w-full max-w-md bg-white shadow-lg p-6 rounded-lg"> {/* Changed max-w-sm to max-w-md */}
                <h1 className="text-4xl font-bold mb-6 text-center">Login</h1>
                <form className="space-y-4" onSubmit={onSubmit}>
                    {/* Rounded email input */}
                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="email" className="text-sm font-serif w-full">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 w-full"
                        />
                    </div>

                    {/* Rounded password input */}
                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="password" className="text-sm font-serif w-full">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 w-full"
                        />
                    </div>

                    {/* Button group */}
                    <div className="flex justify-between mt-6">
                        {/* Register button */}
                        <button
                            type="button"
                            className="w-40 h-12 text-lg opacity-90 hover:bg-gray-100 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-serif flex items-center justify-center relative group"
                            onClick={() => router.push("api/auth/register")} // Navigate to register page
                        >
                            Register
                        </button>

                        {/* Login button */}
                        <button
                            type="submit"
                            className="w-40 h-12 text-lg opacity-90 hover:shadow-inner hover:shadow-blue-800 
                            hover:bg-blue-500 bg-blue-600 shadow-lg text-white py-2 px-4 
                            rounded-xl font-serif flex items-center justify-center relative group"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
