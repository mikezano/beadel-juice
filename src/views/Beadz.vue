<template>
	<div class="beadz">
		<section class="beadz__tools">
			<Tools />
		</section>
		<section class="beadz__view">view</section>
		<section class="beadz__colors">colors</section>
	</div>
</template>

<script>
import Tools from '../components/Tools.vue';
export default {
	data() {
		return {};
	},
	components: {
		Tools,
	},
};
</script>

<style lang="scss">
.beadz {
	display: flex;

	&__tools,
	&__colors {
		width: 14rem;
	}

	&__view {
		flex: auto;
	}

	&__tools,
	&__colors,
	&__view {
		border: 1px solid blue;
	}
}
</style>
