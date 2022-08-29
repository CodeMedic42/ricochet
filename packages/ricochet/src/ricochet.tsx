import React, { memo } from 'react';
import { atom, selector, useRecoilState, useRecoilCallback } from 'recoil';
// @ts-ignore
// import Promise from 'bluebird';
import { Subject } from 'rxjs';
import isNil from 'lodash/isNil';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import noop from 'lodash/noop';
import getPath from 'lodash/get';
import Symbol from 'es6-symbol';
import StartUpItem from './start-up-item';

const accessField = Symbol('Access');
const ricochetStateField = Symbol('RicochetState');
const setRicochetStateField = Symbol('setRicochetState');
const ricochetControlStateField = Symbol('RicochetControlState');
const setRicochetControlStateField = Symbol('setRicochetControlState');
const updateRicochetControlMethod = Symbol('updateRicochetControl');
const ricochetAtomField = Symbol('ricochetAtom');
const ricochetControlAtomField = Symbol('ricochetControlAtom');

const startUpItems = [];

const setRecoil = new Subject();
const finishSetRecoil = new Subject();

const getRecoil = new Subject();
const returnRecoil = new Subject();

type actionMethodType = (actionValue: any) => Promise<any>;

const promiseSetRecoil = (recoilObj, value) =>
	new Promise((resolve) => {
		setRecoil.next({ recoilObj, value });

		finishSetRecoil.subscribe({
			next: (nextValue) => {
				// @ts-ignore
				if (recoilObj === nextValue.recoilObj) {
					setTimeout(() => resolve(recoilObj), 10);
				}
			},
		});
	});

function RicochetRoot() {
	const setStore = useRecoilCallback(
		({ set }) =>
			async (n) => {
				// @ts-ignore
				await set(n.recoilObj, () => n.value);

				// @ts-ignore
				finishSetRecoil.next({ recoilObj: n.recoilObj });
			},
		[],
	);

	const getStore = useRecoilCallback(
		({ snapshot }) =>
			async (recoilObj) => {
				// @ts-ignore
				const valueRecoilObj = await snapshot.getPromise(recoilObj);

				returnRecoil.next({ recoilObj, value: valueRecoilObj });
			},
		[],
	);

	setRecoil.subscribe({
		next: (value) => {
			Promise.resolve().then(() => setStore(value));
		},
	});

	getRecoil.subscribe({
		next: (recoilObj) => {
			Promise.resolve().then(() => getStore(recoilObj));
		},
	});

	// return null;

	return (
		<>
			{map(startUpItems, (startUpItem) => (
				<StartUpItem key={startUpItem.key} item={startUpItem} />
			))}
		</>
	);
}

RicochetRoot.displayName = 'RicochetRoot';

function throwIfNeed(ricochetState) {
	const { error, promise } = ricochetState;

	if (!isNil(error)) {
		throw error;
	} else if (!isNil(promise)) {
		throw promise;
	}
}

function handleAsync(ricochetState, asyncOn = false) {
	const { action } = ricochetState;

	// @ts-ignore
	if (asyncOn === false || asyncOn.length <= 0) {
		return;
	}

	if (asyncOn === true) {
		throwIfNeed(ricochetState);

		return;
	}

	if (isNil(action)) {
		return;
	}

	forEach(asyncOn, (actionId) => {
		if (action === actionId) {
			throwIfNeed(ricochetState);
		}
	});
}

function runAction(
	actionMethod,
	actionMethodName,
	actionArgument,
	{ onSuccess = noop, onError = noop, onFinish = noop } = {},
) {
	const ricochetPromise = actionMethod(actionArgument)
		.then((result) => {
			debugger;
			
			return Promise.all([
				promiseSetRecoil(this[ricochetAtomField], result),
				promiseSetRecoil(this[ricochetControlAtomField], {
					promise: null,
					error: null,
					action: actionMethodName,
					running: false,
				}),
			]).then(() => {
				onSuccess(result);
				onFinish(undefined, result);
			});
		})
		.catch((error) => {
			debugger;

			return promiseSetRecoil(this[ricochetControlAtomField], {
				promise: null,
				error,
				action: actionMethodName,
				running: false,
			}).then(() => {
				onError(error);
				onFinish(error);
			});
		});

	debugger;

	promiseSetRecoil(this[ricochetControlAtomField], {
		promise: ricochetPromise,
		error: null,
		action: actionMethodName,
		running: true,
	});
}

function updateRicochetControl(asyncOn) {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [ricochetState, setRicochetState] = useRecoilState(
		this[ricochetAtomField],
	);
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [ricochetControlState, setRicochetControlState] = useRecoilState(
		this[ricochetControlAtomField],
	);

	this[ricochetStateField] = ricochetState;
	this[setRicochetStateField] = setRicochetState;

	this[ricochetControlStateField] = ricochetControlState;
	this[setRicochetControlStateField] = setRicochetControlState;

	handleAsync(ricochetControlState, asyncOn);

	return this;
}

class RicochetAccess {
	constructor(ricochetAtom, ricochetControlAtom, actionMethods) {
		this[ricochetAtomField] = ricochetAtom;
		this[ricochetControlAtomField] = ricochetControlAtom;
		this[updateRicochetControlMethod] = updateRicochetControl.bind(this);

		forEach(actionMethods, (actionMethod, actionMethodName) => {
			this[actionMethodName] = runAction.bind(
				this,
				actionMethod,
				actionMethodName,
			);
		});
	}

	getError() {
		return this[ricochetControlStateField].error;
	}

	getData(path, defaultValue) {
		if (isNil(path) || path.length <= 0) {
			return this[ricochetStateField];
		}

		return getPath(this[ricochetStateField], path, defaultValue);
	}

	getAction() {
		return this[ricochetControlStateField].action;
	}

	getRunning() {
		return this[ricochetControlStateField].running;
	}

	reset(keepData) {
		if (!keepData) {
			promiseSetRecoil(this[ricochetAtomField], null);
		}

		debugger;

		promiseSetRecoil(this[ricochetControlAtomField], {
			error: null,
			promise: null,
			action: null,
			running: false,
		});
	}
}
type onSetCallbackType = () => void;
type setSelfMethodType = (any, string) => void;
type onSelfMethodType = (onSetCallbackType) => void;

interface onInitializeMethodConfig {
	setSelf: setSelfMethodType;
	onSet: onSelfMethodType,
}

type onInitializeMethodType = (onInitializeMethodConfig) => void;

type getMethodType = (any) => any;

interface onGetMethodConfig {
	get: getMethodType;
	access: any,
}

type onGetMethodType = (onGetMethodConfig) => void;

interface RicochetConfig {
	key: string;
	methods: { [name: string]: actionMethodType },
	onInitialize: onInitializeMethodType,
	onGet: onGetMethodType,
}

function Ricochet({ key, methods, onInitialize, onGet }: RicochetConfig) {
	let setControlInner = null;
	let setDataInner = null;
	let onDataSetInner = null;
	let currentError = null;
	let currentAction = null;

	const initialize = () => {
		if (isNil(setControlInner) || isNil(setDataInner)) {
			return null;
		}

		const setSelf = (newData, action) => {
			const basePromise = Promise.resolve(newData);

			const ricochetPromise = basePromise
				.then((data) => {
					debugger;

					setControlInner({
						promise: null,
						error: null,
						action: currentAction,
						running: false,
					});

					setDataInner(data);
				})
				.catch((error) => {
					debugger;

					setControlInner({
						promise: null,
						error,
						action: currentAction,
						running: false,
					});
				});

			debugger;

			setControlInner({
				promise: ricochetPromise,
				error: currentError,
				action: !isNil(action) ? action: 'setSelf',
				running: true,
			});

			return basePromise;
		};

		const onSet = (callback) => {
			onDataSetInner(callback);
		};

		return onInitialize({ setSelf, onSet });
	};

	const ricochetControlAtom = atom({
		key: `ricochetControlAtom:${key}`,
		default: {
			promise: null,
			error: null,
			action: null,
			running: false,
		},
		effects_UNSTABLE: [
			({ setSelf, onSet }) => {
				setControlInner = setSelf;

				onSet((newValue) => {
					currentError = newValue.error;
					currentAction = newValue.action;
				});

				return !isNil(onInitialize) ? initialize() : null;
			},
		],
	});

	const ricochetAtom = atom({
		key: `ricochetAtom:${key}`,
		default: null,
		effects_UNSTABLE: [
			({ setSelf, onSet }) => {
				setDataInner = setSelf;
				onDataSetInner = onSet;

				return !isNil(onInitialize) ? initialize() : null;
			},
		],
	});

	const ricochet = selector({
		key: `ricochetSelector:${key}`,
		get: ({ get }) => {
			const data = get(ricochetAtom);

			return data;
		},
		set: ({ set }, data) => {
			debugger;

			set(ricochetAtom, !isNil(data) ? data : null);
			set(ricochetControlAtom, {
				promise: null,
				error: null,
				action: null,
				running: false,
			});
		},
	});

	ricochet[accessField] = new RicochetAccess(
		ricochetAtom,
		ricochetControlAtom,
		methods,
	);

	if (!isNil(onGet)) {
		const startUpSelector = selector({
			key: `startupSelector:${key}`,
			get: ({ get }) => {
				onGet({ get, access: ricochet[accessField] });

				return null;
			},
		});

		startUpItems.push(startUpSelector);
	}

	return ricochet;
}

function useRicochet(ricochet: RicochetAccess, asyncOn: boolean | string[]) {
	return ricochet[accessField][updateRicochetControlMethod](asyncOn);
}

export { Ricochet, useRicochet };

export default memo(RicochetRoot);
