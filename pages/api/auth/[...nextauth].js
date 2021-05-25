import { Db } from 'mongodb';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { verifyPassword } from '../../../lib/auth';
import { connectDatabase } from '../../../lib/db';
export default NextAuth({
	// Configure one or more authentication providers
	session: {
		jwt: true,
	},
	providers: [
		Providers.Credentials({
			async authorize(credentials, req) {
				const client = await connectDatabase();
				const userCollection = client.db().collection('users');
				// check user is exist
				const user = await userCollection.findOne({ email: credentials.email });
				if (!user) {
					client.close();
					throw new Error('No user found!');
				}
				/// compare password correct
				const isValid = verifyPassword(credentials.password, user.password);
				if (!isValid) {
					client.close();
					throw new Error('Could not log in!');
				}
				client.close();
				return { email: user.email };
			},
		}),
		// ...add more providers here
	],
});
