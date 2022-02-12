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
		hl: {}
	}
	constructor() {
		let state = JSON.parse(new URLSearchParams(window.location.search).get('state'))
		p(state)
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
		let new_url = window.location.protocol + '//' + window.location.host + window.location.pathname + '?state=' + encodeURIComponent(JSON.stringify(this.args))
		p('Saving url', new_url)
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
		this.color_picker = new ColorPicker(document.querySelector('color-picker'))
		this.nodes = get_nodes()
		this.nodes_by_tier = []
		this.state = new State()
		this.nodes.forEach(node => {
			let nodes = this.nodes_by_tier[node.tier-1] = this.nodes_by_tier[node.tier-1]??[]
			nodes.push(node)
		})

		this.update()
	}

	update() {

		this.nodes.forEach(node => node.hl = null)

		if(this.state.get('hl')) {
			p('adding colors', this.state.get('hl'))
			let hl = this.state.get('hl')
			for(let name in hl) {
				let color = hl[name]
				this.nodes
					.filter(node => node.name == name)
					.forEach(node => this.select(node, color))
			}
		}

		p('updating', this.state)
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
					.style('background-color', node => node.hl)
					.on('click', (_, node) => {
						if(this.state.get('hl')[node.name]) {
							delete this.state.get('hl')[node.name]
						} else {
							this.state.get('hl')[node.name] = this.color_picker.color
						}
						this.state.save()
						this.update()
						// d3.selectAll('#data .col')
							// .filter(node => node.hl)
							// .text(node => 'gottem')
					})
					
	}

	select(node, color) {
		node.hl = color
		if(node.recipe.length > 0) {
			let base_nodes = 0
			node.recipe.forEach(node => base_nodes += this.select(node, color))
			return base_nodes
		} else {
			return 1
		}
	}

}

function create_node(selection) {
	selection
		.classed('node', true)
		.append('div')
		.text(node => format(node.name))

	let description = selection
		.append('div')
		.classed('description', true)

	description
		.selectAll('img')
		.data(node => node.rewards)
		.enter()
			.append('img')
			.attr('src', reward => `/images/${reward}.png`)
			.attr('title', reward => reward)

	description
		.append('div')
		.classed('effect', true)
		.text(node => node.short_effect)
		.attr('title', node => node.effect)

}

function format(name) {
	return name.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
}


