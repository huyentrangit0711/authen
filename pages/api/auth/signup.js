import { hashPassword } from '../../../lib/auth';
import { connectDatabase } from '../../../lib/db';

async function handler(req, res) {
	if (req.method === 'POST') {
		const data = req.body;
		const { email, password } = data;
		console.log('api', email);
		if (!email || !password || !email.includes('@') || password.trim().length < 7) {
			res.status(422).json({
				message: 'Invalid input - password should also be at least 7 characters long.',
			});
			return;
		}

		const client = await connectDatabase();
		const db = client.db();
		const hashedPassword = await hashPassword(password);
		// check user email unique
		const isUniqueEmail = await db.collection('users').findOne({ email: email });
		if (isUniqueEmail) {
			res.status(422).json({
				message: {
					email: 'User exist on system.',
				},
			});
			client.close();
			return;
		}
		await db
			.collection('users')
			.insertOne({
				email,
				password: hashedPassword,
			})
			.then((data) => {
				res.status(201).json({
					message: 'Created user successful',
				});
			})
			.catch((error) => {
				res.status(422).json({
					message: 'Have error on insert new user',
				});
			});

		client.close();
	}
}
export default handler;
