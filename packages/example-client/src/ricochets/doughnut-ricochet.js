import axios from 'axios';
import { Ricochet } from 'ricochet';

async function getDoughnut() {
	const response = await axios({
		method: 'get',
		url: '/doughnuts',
	});

	return response.data;
}

async function putDoughnut(data) {
	throw new Error('Must handle update to primary list');

	// await axios({
	// 	method: 'post',
	// 	url: `/doughnuts/${data.id}`,
	// });

	// return data;
}

async function deleteDoughnut(data) {
	throw new Error('Not handled yet');

	// const response = await axios({
	// 	method: 'post',
	// 	url: '/doughnuts',
	// });

	// return response.data;
}

function onSetDoughnut(doughnut) {
	debugger;
}

export default Ricochet({
	key: 'doughnuts',
	methods: {
		getDoughnut,
		putDoughnut,
		deleteDoughnut,
	},
	onInitialize: ({ onSet }) => {
		onSet(onSetDoughnut);
	},
});
