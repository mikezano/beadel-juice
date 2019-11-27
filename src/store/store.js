import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		counter: 2,
		pixelData: []
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
		updatePixelData: (state, newPixelData) => {
			state.pixelData = newPixelData;
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
