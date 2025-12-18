'use client'
import { useState } from 'react'

const Bookevent = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    }

    return (
        <div id='book-event'>
            {submitted ? (
                <p className='text-sm'>Thanks for booking!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder='Enter your email address' />
                    </div>
                    <button type="submit" className='button-submit'>Submit</button>
                </form>
            )}
        </div>
    )
}

export default Bookevent;