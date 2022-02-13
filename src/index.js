// import * as d3 from 'd3-selection'
import {Node, get_nodes} from './data'
import './index.sass'
import {ColorPicker} from './color-picker'

let p = console.log

window.onload = () => new App()

let state
let color_picker

class State {
	args = {
		select: {},
	}
	constructor() {
		let state = JSON.parse(new URLSearchParams(window.location.search).get('state'))
		for(let key in state) {
			this.args[key] = state[key]
		}
			
	}

	get(key) {
		return this.args[key]
	}

	set(key, value) {
		this.args[key] = value
	}

	delete(key) {
		delete this.args[key]
	}

	save() {
		let new_url = window.location.protocol + '//' + window.location.host + window.location.pathname + '?state=' + JSON.stringify(this.args)
		window.history.pushState({path:new_url}, '', new_url)
		// window.location.search = this.args.toString()
	}
}


class App {
	state
	color_picker
	nodes
	nodes_by_tier

	constructor() {
		this.state = new State()

		this.color_picker = new ColorPicker(document.querySelector('color-picker'))
		this.color_picker.color = 

		this.nodes = get_nodes()
		this.nodes_by_tier = []
		this.nodes.forEach(node => {
			let nodes = this.nodes_by_tier[node.tier-1] = this.nodes_by_tier[node.tier-1]??[]
			nodes.push(node)
		})

		this.update()
	}

	update() {

		// clear select state of all nodes
		this.nodes.forEach(node => {
			node.select = null
			node.descendants = []
		})

		// set select/descendant state from URLSearchParams in State
		let select = this.state.get('select')
		if(select) {
			for(let name in select) {
				let color = select[name]
				if(!color) continue
				this.nodes
					.filter(node => node.name == name)
					.forEach(node => this.select(node, color))
			}
		}

		// p('updating', this.state)
		d3.selectAll('#data div').remove()
		d3.select('#data')
			.selectAll('div')
			.data(this.nodes_by_tier)
			.enter()
				.append('div')
				.classed('tier', true)
				.selectAll('div')
				.data(nodes => nodes)
				.enter()
					.append('div')
					.call(create_node)
					.style('background-color', node => node.select)
					.on('click', (_, node) => {
						if(this.state.get('select')[node.name]) {
							delete this.state.get('select')[node.name]
						} else {
							this.state.get('select')[node.name] = this.color_picker.color
						}
						this.state.save()
						this.update()
					})
					
	}

	select(node, color) {
		node.select = color
		function select_recipe(node, color) {
			node.recipe.forEach(node => {
				node.descendants.push(color)
				select_recipe(node, color)
			})
		}

		select_recipe(node, color)
	}

}
function update_node(selection) {
	selection
		.style('background-color', node => node.select)

	selection
		.select('.descendants')
		.data(node => node.descendants)
		.enter()
			.append('div')
			.style('background-color', color => color)
		.exit()
			.remove()

}

function create_node(selection) {
	selection
		.classed('node', true)
		.append('div')
		.text(node => format(node.name))
		.attr('title', node => node.recipe.map(node => format(node.name)).join(' + '))

	let description = selection
		.append('div').classed('description', true)

	description
		.selectAll('img')
		.data(node => node.rewards)
		.enter()
			.append('img')
			.attr('src', reward => `images/${reward}.png`)
			.attr('title', reward => reward)

	description
		.append('div').classed('effect', true)
		.text(node => node.short_effect)
		.attr('title', node => node.effect)

	description
		.append('div').classed('descendants', true)
		.selectAll('div')
		.data(node => node.descendants)
		.enter()
			.append('div')
			.style('background-color', color => color)

}

function format(name) {
	return name.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
}


