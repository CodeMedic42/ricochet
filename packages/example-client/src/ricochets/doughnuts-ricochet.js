import axios from 'axios';
import { Ricochet } from 'ricochet';

async function getDoughnuts() {
	const response = await axios({
		method: 'get',
		url: '/doughnuts',
	});

	return response.data;
}

async function postDoughnut(body) {
	throw new Error('Must handle update');

	// const response = await axios({
	// 	method: 'post',
	// 	url: '/doughnuts',
	// 	body,
	// });

	// return response.data;
}

export default Ricochet({
	key: 'doughnuts',
	methods: {
		getDoughnuts,
		postDoughnut,
	},
	onInitialize: ({ setSelf }) => {
		setSelf(getDoughnuts());
	},
});
