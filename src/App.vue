<template>
	<div id="app">
		<h1 class="title">Beadel Juice</h1>
		<router-view />
	</div>
</template>

<style lang="scss">
html,
body {
	padding: 0;
	margin: 0;
	overflow: hidden;
}
.title {
	padding: 0;
	margin: 0;
	font-size: 3rem;
}
#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: white;
	background-color: #222;
	height: 100vh;
}

#nav {
	padding: 30px;

	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>
