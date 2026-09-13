import {stageName,type Creature} from './creatures';

// Stable family seeds keep encyclopedia measurements consistent across sessions.
// Power describes the Sipling's lore; discovery still depends on trails and bonding.
const growth = [
 {name:'Wild growth',heights:[1,2.8,6.5],power:[1,2.5,5.4],detail:'A familiar little face grows into a towering guardian.'},
 {name:'Grand awakening',heights:[1,3.7,9],power:[1,3.1,7],detail:'New armor, sweeping crests, and elemental energy awaken with each stage.'},
 {name:'Total metamorphosis',heights:[1,4.5,13],power:[1,3.7,9],detail:'Each evolution transforms its body into something extraordinary.'},
] as const;
const powers:Record<string,[string,string,string]>={
 Grove:['Leaf flicker','Bramble surge','Worldroot tempest'],Cloud:['Mist puff','Thunder mantle','Heavenbreak storm'],Earth:['Pebble pulse','Stone bulwark','Continental roar'],Water:['Dew sparkle','Torrent veil','Abyssal maelstrom'],Melody:['Tiny trill','Resonant cry','Celestial requiem'],Ember:['Ember kiss','Furnace flare','Inferno dominion'],Velvet:['Soft step','Gilded claw','Sovereign eclipse'],Moon:['Moon glimmer','Lunar scythe','Midnight apocalypse'],Star:['Star mote','Comet burst','Supernova crown'],Bakery:['Sugar spark','Caramel armor','Molten sugar titan'],Dream:['Dream wisp','Mirage spiral','Dreamscape rupture'],Frost:['Snow flurry','Glacial fang','Everfrost cataclysm'],Crystal:['Prism glint','Shatter lance','Prismatic judgment'],Electric:['Static spark','Volt rush','Thunderfall'],Metal:['Silver glint','Steel bastion','Ironclad dominion'],Coffee:['Bean spark','Espresso surge','Dark roast eruption'],Harvest:['Seed shimmer','Vine breaker','Autumn colossus'],Cocoa:['Cocoa puff','Truffle shell','Obsidian cacao storm'],Candy:['Candy glint','Crystal crunch','Sugarshard cyclone'],Honey:['Honey drop','Amber guard','Golden hive sovereign'],Tea:['Tea mist','Jade infusion','Emerald monsoon'],Spice:['Pepper spark','Cinder rush','Saffron firestorm'],Sky:['Feather flutter','Gale talon','Skybreaker dive'],Storm:['Thunder purr','Lightning fang','Tempest annihilation'],Sun:['Sunbeam','Solar mantle','Dawnbreaker'],Clockwork:['Gear tick','Overdrive','Titan engine'],Paper:['Paper flutter','Origami edge','Thousandfold tempest'],Glow:['Lantern flicker','Radiant pulse','Lightbringer nova']
};
export function evolutionProfile(c:Creature){
 const seed=[...c.family].reduce((sum,ch)=>sum+ch.charCodeAt(0),0);
 const path=growth[seed%growth.length];const stage=c.stage-1;
 const height=Number(((.18+(seed%18)/100)*path.heights[stage]).toFixed(2));
 const power=Math.round((32+seed%24)*path.power[stage]);
 const ability=(powers[c.type]??[`${c.type} spark`,`${c.type} surge`,`${c.type} dominion`])[stage];
 return {height,power,ability,path:path.name,detail:path.detail,label:stageName(c.stage)};
}
