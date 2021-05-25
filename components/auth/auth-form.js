import { useState, useRef } from 'react';
import classes from './auth-form.module.css';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';

function AuthForm() {
	const [isLogin, setIsLogin] = useState(false);
	const [error, setError] = useState([]);
	const emailRef = useRef();
	const passwordRef = useRef();
	const router = useRouter();
	function switchAuthModeHandler() {
		setIsLogin((prevState) => !prevState);
	}
	const createUser = async (email, password) => {
		const response = await fetch('/api/auth/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});
		const data = response.json();

		if (!response.ok) {
			const error = await data.then((value) => value.message);
			setError([error]);
			return;
		}
		return data;
	};
	console.log(error);
	const onSubmitHandler = async (event) => {
		event.preventDefault();
		if (isLogin) {
			/// code log in
			const result = await signIn('credentials', {
				redirect: false,
				email: emailRef.current.value,
				password: passwordRef.current.value,
			});
			if (!result.error) {
				router.push('/profile');
			}
		} else {
			try {
				const result = await createUser(emailRef.current.value, passwordRef.current.value);
				console.log(result);
			} catch (error) {
				console.log('error', error);
			}
		}
	};
	return (
		<section className={classes.auth}>
			<h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
			<form onSubmit={onSubmitHandler}>
				<div className={classes.control}>
					<label htmlFor="email">Your Email</label>
					<input type="email" id="email" required ref={emailRef} />
				</div>
				<div className={classes.control}>
					<label htmlFor="password">Your Password</label>
					<input type="password" id="password" required ref={passwordRef} />
				</div>
				{error.length > 0 && error.email}
				<div className={classes.actions}>
					<button>{isLogin ? 'Login' : 'Create Account'}</button>
					<button type="button" className={classes.toggle} onClick={switchAuthModeHandler}>
						{isLogin ? 'Create new account' : 'Login with existing account'}
					</button>
				</div>
			</form>
		</section>
	);
}

export default AuthForm;
