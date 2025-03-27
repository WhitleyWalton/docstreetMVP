import React, { useState } from 'react';
import supabase from './supabaseClient';

function Auth() {
    const [authMode, setAuthMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();

        if (authMode === 'register') {
            // Sign up user with Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });

            if (error) {
                setMessage(error.message);
                return;
            }

            // Store user profile separately
            if (data.user) {
                await supabase.from('users').insert([{ id: data.user.id, name, email }]);
                setMessage("Registration successful! Please check your email for verification.");
            }
        } else {
            // Login user
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                setMessage(error.message);
                return;
            }

            setMessage("Login successful!");
        }
    };

    return (
        <div>
            <h2>{authMode === 'register' ? 'Register' : 'Login'}</h2>
            <form onSubmit={handleAuth}>
                {authMode === 'register' && (
                    <div>
                        <label>Name:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                )}
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">{authMode === 'register' ? 'Register' : 'Login'}</button>
            </form>
            <button onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}>
                {authMode === 'register' ? 'Switch to Login' : 'Switch to Register'}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Auth;
