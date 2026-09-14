export type NoteProgress = { coffees: number; friends: number; explorations: number; evolutions: number; care: number; games: number };
export type LittleNote = { id: string; title: string; message: string };
const milestones: (LittleNote & { metric: keyof NoteProgress; at: number })[] = [
  { id:'coffee-1',metric:'coffees',at:1,title:'Your first little ritual',message:'A warm cup, a little pause, and a memory worth keeping. Here’s to many cozy moments, Marissa.' },
  { id:'coffee-10',metric:'coffees',at:10,title:'A cup full of memories',message:'Ten coffee moments tucked away. The ordinary little things can become the sweetest memories.' },
  { id:'coffee-30',metric:'coffees',at:30,title:'Your cozy corner is growing',message:'Thirty little pauses. I hope this café keeps giving you a soft place to land, Marissa.' },
  { id:'friends-5',metric:'friends',at:5,title:'A tiny welcoming committee',message:'Five Siplings have found their way to you. They’ve clearly heard you’re excellent company.' },
  { id:'friends-25',metric:'friends',at:25,title:'Quite the little gathering',message:'Twenty-five friends! Someone should probably put another pot of coffee on.' },
  { id:'friends-100',metric:'friends',at:100,title:'A hundred little wonders',message:'A hundred Siplings, and still so much wonder ahead. Your curiosity makes this little world come alive.' },
  { id:'friends-300',metric:'friends',at:300,title:'Look at all this wonder',message:'Three hundred friends. Somewhere in this café, a tiny Sipling is trying to organize a very large group hug.' },
  { id:'friends-600',metric:'friends',at:600,title:'Every little friend, found',message:'All six hundred Siplings are home. What a beautiful little world you’ve made, Marissa.' },
  { id:'explore-1',metric:'explorations',at:1,title:'A little brave beginning',message:'One small adventure can lead to something lovely. I’m glad you took that first step, Marissa.' },
  { id:'explore-20',metric:'explorations',at:20,title:'A heart for adventure',message:'Twenty adventures later, there’s still magic around the next corner. Take your curiosity with you.' },
  { id:'evolve-1',metric:'evolutions',at:1,title:'Small beginnings, big wonder',message:'That tiny friend had something magnificent inside all along. Growing into something new takes a little care.' },
  { id:'evolve-10',metric:'evolutions',at:10,title:'Look how far they’ve grown',message:'Ten transformations, each its own kind of wonderful. Thank you for giving little things room to grow.' },
  { id:'care-5',metric:'care',at:5,title:'Kindness looks good on you',message:'Five little acts of care. Your Siplings appreciate every one—and probably have a few crumbs on their faces to prove it.' },
  { id:'game-1',metric:'games',at:1,title:'A tiny victory dance',message:'Your first memory-game win deserves a happy little wiggle. The Siplings are already doing theirs.' },
];
export const surpriseNotes: LittleNote[] = [
  ['made-for-you','Just for you, Marissa','This little world was made to bring you a smile. I hope it finds you at just the right moment.'],
  ['warmth','A pocket of warmth','May your coffee be lovely, your shoulders feel lighter, and your day have a little unexpected goodness in it.'],
  ['bean','An important café update','A Sipling has appointed itself your official cheerleader. It is very small, very determined, and entirely on your side.'],
  ['rest','Permission to pause','You don’t have to earn a quiet moment. Take a breath, settle in, and let this one be yours.'],
  ['faith','A gentle wish','May you feel loved and held today, Marissa. There is room here for your hopes, your prayers, and your quiet moments.'],
  ['tiny','Something lovely','A little kindness. A warm mug. A very round Sipling. Sometimes joy arrives in the smallest packages.'],
  ['enough','For an ordinary day','You don’t have to make today extraordinary to find something beautiful in it.'],
  ['coffee','The café is on your side','Your imaginary coffee is always the perfect temperature. Your tiny friends are always happy you’re here.'],
  ['wonder','Keep a little wonder','I hope something makes you smile today—the kind of smile that sneaks up on you.'],
  ['grace','A little grace','Some days bloom slowly. Be gentle with yourself while yours unfolds.'],
  ['welcome','A familiar little place','Welcome back to your soft little corner of the world, Marissa. There’s always a place for you here.'],
  ['secret','A tiny secret','The Siplings held a meeting. The agenda was snacks. They also agreed that you’re pretty wonderful.'],
].map(([id,title,message])=>({id,title,message}));
export function milestoneNote(progress: NoteProgress, seen: string[]): { note: LittleNote; covered: string[] } | null {
  const eligible = milestones.filter(n => progress[n.metric] >= n.at && !seen.includes(n.id));
  if (!eligible.length) return null;
  // Collapse existing progress into one celebration instead of queuing a backlog.
  return { note: eligible[eligible.length - 1], covered: eligible.map(n => n.id) };
}
export function randomNote(seen: string[], random = Math.random): LittleNote {
  const fresh = surpriseNotes.filter(n => !seen.includes(n.id));
  const choices = fresh.length ? fresh : surpriseNotes.filter(n => n.id !== seen.at(-1));
  return choices[Math.min(choices.length - 1, Math.floor(random() * choices.length))];
}
