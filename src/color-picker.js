import './color-picker.sass'

let colors = [
	'#FBB',
	'#B77',
	'#944',
	'#FBF',
	'#B7B',
	'#949',
	'#BBF',
	'#77B',
	'#449',
	'#BFF',
	'#7BB',
	'#499',
	'#CFC',
	'#7B7',
	'#252',
]


export class ColorPicker {
	color = null
	color_divs = []

	constructor(element) {
		element.classList.add('color-picker')

		colors.forEach(color => {
			let div = document.createElement('div')
			div.dataset.color = color
			div.style.background = color
			div.onclick = (event) => {
				this.color = color
				element.querySelectorAll('div').forEach(div => div.classList.remove('selected'))
				div.classList.add('selected')
			}
			element.appendChild(div)
		})
	}

}
