export class Node {
	constructor(
		name,
		recipe = [],
		rewards = [],
		effect = null,
		short_effect = null,
		tier = undefined
	) {
		this.name = name
		this.recipe = recipe
		this.rewards = rewards
		this.effect = effect
		this.short_effect = short_effect
		this.tier = tier
	}
}

export function get_nodes() {
	let map = new Map()

	// Tree structure
	recipes.trim().split('\n')
		.map(line => line.trim().split(' '))
		.map(line => new Node(line[0], line.slice(1)))
		.forEach(node => map.set(node.name, node))

	map.forEach(node => node.recipe = node.recipe.map(name => map.get(name)))

	// Tier
	map.forEach(node => set_tier(node))

	// Rewards
	rewards.trim().split('\n')
		.map(line => line.trim().split(' '))
		.map(line => map.get(line[0]).rewards = line.slice(1))

	// Effects
	effects.trim().split('\n')
		.map(line => line.trim().split(' '))
		.map(line => map.get(line[0]).effect = line.slice(1).join(' '))
	short_effects.trim().split('\n')
		.map(line => line.trim().split(' '))
		.map(line => map.get(line[0]).short_effect = line.slice(1).join(' '))

	return [...map.values()].sort((a,b) => a.name > b.name? 1: -1)
}

function set_tier(node) {
	if(node.recipe.length == 0) {
		node.tier = 1
		return
	}
	let max_tier = 1
	node.recipe.forEach(node => {
		if(node.tier == undefined) {
			set_tier(node)
		}
		max_tier = Math.max(max_tier, node.tier)
	})
	node.tier = max_tier + 1
}

const recipes = `
toxic
deadeye
arcane_buffer
echoist
dynamo
bloodletter
steel-infused
gargantuan
berserker
sentinel
vampiric
soul_conduit
frenzied
juggernaut
opulent
malediction
consecrator
overcharged
chaosweaver
frostweaver
permafrost
hasted
bombadier
flameweaver
incendiary
stormweaver
bonebreaker
heralding_minions dynamo arcane_buffer
assassin deadeye vampiric
rejuvenating gargantuan vampiric
executioner frenzied berserker
treant_hoard toxic sentinel steel-infused
mirror_image echoist soul_conduit
entangler toxic bloodletter
trickster overcharged assassin
necromancer bombadier overcharged
hexer chaosweaver echoist
drought_bringer malediction deadeye
temporal_bubble juggernaut hexer arcane_buffer
frost_strider frostweaver hasted
ice_prison frostweaver hasted
soul_eater soul_conduit necromancer gargantuan
flame_strider flameweaver hasted
corpse_detonator necromancer incendiary
evocationist flameweaver frostweaver stormweaver
magma_barrier incendiary bonebreaker
storm_strider stormweaver hasted
mana_siphoner consecrator dynamo
corrupter bloodletter chaosweaver
invulnerable sentinel juggernaut consecrator
crystal-skinned permafrost rejuvenating berserker
empowered_elements evocationist steel-infused chaosweaver
effigy hexer malediction corrupter
lunaris-touched invulnerable frost_strider empowering_minions
solaris-touched invulnerable magma_barrier empowering_minions
arakaali-touched corpse_detonator entangler assassin
brine_king-touched ice_prison storm_strider heralding_minions
tukohama-touched bonebreaker executioner magma_barrier
abberath-touched flame_strider frenzied rejuvenating
shakari-touched entangler soul_eater drought_bringer
innocence-touched lunaris-touched solaris-touched mirror_image mana_siphoner
kitava-touched tukohama-touched abberath-touched corrupter corpse_detonator
empowering_minions necromancer executioner gargantuan
`

const rewards = `
toxic generic gem
deadeye generic jewellery
arcane_buffer essence
echoist generic currency
dynamo generic jewellery
bloodletter weapon jewellery
steel-infused weapon
gargantuan currency
berserker unique
sentinel armour armour
vampiric fossil
soul_conduit map
frenzied generic unique
juggernaut harbinger
malediction divination
consecrator fragment
overcharged jewellery jewellery
chaosweaver gem
frostweaver armour
permafrost generic armour
hasted generic
bombadier weapon armour
flameweaver weapon
incendiary generic weapon
stormweaver jewellery
bonebreaker generic weapon
heralding_minions fragment fragment
assassin currency currency
rejuvenating currency
executioner legion breach
treant_hoard generic
mirror_image scarab
entangler fossil fossil
trickster currency unique divination
necromancer generic
hexer essence essence
drought_bringer lab lab
temporal_bubble heist expedition
frost_strider armour armour armour
ice_prison armour armour
soul_eater map map
flame_strider weapon weapon weapon
corpse_detonator divination divination
evocationist generic weapon armour
magma_barrier weapon weapon
storm_strider jewellery jewellery jewellery
mana_siphoner jewellery jewellery
corrupter abyss abyss
invulnerable delirium metamorph
crystal-skinned harbinger harbinger
empowered_elements unique unique
effigy divination divination
lunaris-touched unique
solaris-touched scarab
arakaali-touched divination
brine_king-touched armour armour armour
tukohama-touched weapon weapon fragment
abberath-touched jewellery jewellery map
shakari-touched unique
innocence-touched currency currency currency
kitava-touched generic
empowering_minions blight ritual
`

const effects = `
bloodletter Items Dropped from the monster and its minions are corrupted
rejuvenating Rewards are rolled 1 additional time, choosing the rarest result
treant_hoard Monster's Minions Drop A Randomly- Chosen Reward Type
mirror_image Rewards are rolled 2 additional times
necromancer Rewards are rolled 2 additional times
magma_barrier Rewards are rolled 2 additional times
mana_siphoner Rewards are rolled 1 additional time
corrupter Items Dropped from the monster and its minions are corrupted
empowered_elements Rewards are rolled 1 additional time choosing the rarest result
effigy Rewards are rolled an additional time
lunaris-touched All reward types have an additional reward
solaris-touched All reward types have an additional reward
arakaali-touched All rewards are divination cards
brine_king-touched Rewards are rolled 6 additional times
tukohama-touched Rewards are rolled 4 additional times
abberath-touched Rewards are rolled 4 additional times
shakari-touched All reward types are unique
innocence-touched All reward types are currency
kitava-touched Rewards are doubled
`

const short_effects = `
bloodletter Corrupted
rejuvenating 1 reroll
treant_hoard Minion drops
mirror_image 2 rerolls
necromancer 2 rerolls
magma_barrier 2 rerolls
mana_siphoner 2 rerolls
corrupter Corrupted
empowered_elements 1 reroll
effigy 1 reroll
lunaris-touched +1 reward
solaris-touched +1 reward
arakaali-touched All rewards div
brine_king-touched 6 rerolls
tukohama-touched 4 rerolls
abberath-touched 4 rerolls
shakari-touched All rewards unique
innocence-touched All rewards currency
kitava-touched Rewards doubled
`
