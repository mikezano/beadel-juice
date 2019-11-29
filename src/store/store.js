import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		counter: 2,
		pixelData: [],
		width: 0,
		height: 0,
		zoom: 0
	},
	getters: {
		tripleCounter: state => {
			return state.counter * 3;
		},
		getComponent: state => name => {
			var result = state.registry.get(name);
			return result;
		},
		getComponents: state => () => {
			return state.registry.components;
		},
		getPixelData: state => state.pixelData
	},
	mutations: {
		increment: (state, num) => {
			state.counter += num;
		},
		decrement: state => {
			state.counter--;
		},
		updatePixelData: (state, payload) => {
			state.pixelData = payload.pixelData;

			state.width = payload.width || state.width;
			state.height = payload.height || state.height;
		},
		updateZoom: (state, newZoom) => {
			state.zoom = newZoom;
		}
	},
	actions: {
		//parameter deconstruct
		asyncDecrement: ({ commit }, asyncNum) => {
			return new Promise(resolve => {
				setTimeout(() => {
					commit("decrement", asyncNum.by);
					resolve();
				}, asyncNum.duration);
			});
		}
	}
});
