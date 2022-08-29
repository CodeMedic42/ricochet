import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

const doughnuts = [{
    id: 1, 
    name: 'Boston Creme',
}, {
    id: 2, 
    name: 'Sugared',
}, {
    id: 3, 
    name: 'Bear Claw',
}];

mock.onGet("/doughnuts").reply(200, doughnuts);

mock.onPost("/doughnuts").reply(200, (...args) => { debugger; });

mock.onPut("/doughnuts/*").reply(200, (...args) => { debugger; });

mock.onDelete("/doughnuts/*").reply(200, (...args) => { debugger; });