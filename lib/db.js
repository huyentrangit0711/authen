import { MongoClient } from 'mongodb';
const DATABASE_URL =
	'mongodb+srv://TTHT0711janet:9K0MMnp7QThTafpY@cluster0.hkhoh.mongodb.net/auth-demo?retryWrites=true&w=majority';

export async function connectDatabase() {
	const client = await MongoClient.connect(DATABASE_URL);
	return client;
}
