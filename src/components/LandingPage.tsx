import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Gamepad2, Trophy, Star, Shield, Heart, Zap, Brain, ArrowRight, Download, Smartphone, CheckCircle, KeyRound, Users } from 'lucide-react';

interface LandingPageProps {
  onParentSetup: () => void;
  onKidLink: () => void;
  isParentSetup?: boolean;
}

export function LandingPage({ onParentSetup, onKidLink, isParentSetup }: LandingPageProps) {
  return (
    <div className="h-[100dvh] w-full bg-orange-500 font-sans overflow-y-auto overflow-x-hidden selection:bg-lime-400 custom-scrollbar relative">

      {/* Hero Section (Codepen Layout) */}
      <header className="relative min-h-[95vh] flex items-center justify-center p-4 md:p-8 w-full max-w-[1400px] mx-auto mt-4">
        <div className="relative w-full h-full min-h-[85vh] bg-purple-600 rounded-[2rem] md:rounded-[3rem] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center overflow-hidden z-10 p-6 md:p-8">
          
          {/* Top Left Cutout / Logo Tab */}
          <div className="absolute top-0 left-0 bg-orange-500 md:bg-white border-b-4 border-r-4 border-black rounded-br-[1.5rem] md:rounded-br-[2rem] px-4 py-3 md:px-6 md:py-4 flex items-center gap-2 md:gap-3 z-30">
            <img src="/characters/Wormies - Party.svg" alt="Hadoota" className="w-8 h-8 md:w-10 md:h-10 object-contain wormie-stroke" />
            <span className="font-black text-xl md:text-3xl uppercase tracking-tighter text-white md:text-black" style={{ textShadow: '1px 1px 0px black' }}>Hadoota</span>
          </div>

          {/* Top Nav Links (Center/Right) */}
          <nav className="absolute top-0 right-0 left-0 hidden md:flex justify-end lg:justify-center items-center px-8 py-6 z-30 pointer-events-none">
             <div className="flex gap-8 font-bold text-white text-sm uppercase tracking-widest pointer-events-auto mr-auto lg:mr-0 lg:ml-32">
                <a href="#" className="hover:text-lime-400 transition-colors">Games</a>
                <a href="#" className="hover:text-lime-400 transition-colors">Stories</a>
                <a href="#" className="hover:text-lime-400 transition-colors">Parents</a>
                <a href="#" className="hover:text-lime-400 transition-colors">Rewards</a>
             </div>
             
             {/* Top Right Buttons */}
             <div className="absolute right-8 top-4 flex items-center gap-3 pointer-events-auto">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onParentSetup}
                  className="bg-lime-400 border-2 border-black text-black px-5 py-2.5 rounded-full font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-lime-300 transition-colors flex items-center gap-2 cursor-pointer">
                  <Users className="w-4 h-4" /> Parent Login
                </button>
             </div>
          </nav>

          {/* Huge Background Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
             <span className="text-[28vw] md:text-[22vw] font-black text-white uppercase tracking-tighter leading-none whitespace-nowrap opacity-90" style={{ fontFamily: '"Anton", sans-serif' }}>
               HADOOTA
             </span>
          </div>

          {/* Center Mascot (The "Product") */}
          <motion.div initial={{ scale: 0, y: 50 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="relative z-20 mt-16 md:mt-8">
            <img src="/characters/Wormies - Spring.svg" alt="Hadoota Mascot" className="h-[45vh] md:h-[65vh] object-contain wormie-stroke" />
          </motion.div>

          {/* Bottom Controls / Info */}
          <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 z-30 flex flex-col md:flex-row justify-between items-end gap-6 md:gap-0">
            {/* Bottom Left Info */}
            <div className="max-w-sm text-left">
              <h2 className="text-3xl md:text-5xl font-black text-lime-400 uppercase tracking-tight mb-3" style={{ textShadow: '2px 2px 0px black' }}>PREMIUM</h2>
              <p className="font-bold text-white mb-6 text-sm leading-relaxed max-w-xs">
                Engineered for daily learning adventures. Durable curriculum, lightweight games, built to grow with your child.
              </p>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onKidLink} className="bg-yellow-400 border-2 border-black px-6 py-3 rounded-full font-black text-sm uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 transition-colors flex items-center gap-2 cursor-pointer">
                  <KeyRound className="w-4 h-4" /> Start Playing
                </motion.button>
              </div>
            </div>

            {/* Bottom Right Stats Box */}
            <div className="hidden sm:flex flex-col bg-white/20 backdrop-blur-md border-2 border-white/50 p-5 rounded-2xl w-56">
               <span className="text-4xl font-black text-white" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}>98%</span>
               <div className="flex -space-x-2 my-2">
                 <div className="w-8 h-8 rounded-full bg-orange-400 border-2 border-white flex items-center justify-center font-bold text-xs">J</div>
                 <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-white flex items-center justify-center font-bold text-xs">A</div>
                 <div className="w-8 h-8 rounded-full bg-lime-400 border-2 border-white flex items-center justify-center font-bold text-xs">M</div>
               </div>
               <span className="text-xs font-bold text-white/90 leading-tight">Customer satisfaction rating across all kids</span>
            </div>
          </div>
        </div>
      </header>

      {/* App Preview / Mock */}
      <section className="px-6 py-10 md:py-16 max-w-5xl mx-auto">
        <div className="bg-white border-4 md:border-[6px] border-black rounded-[2rem] md:rounded-[3rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="bg-purple-600 p-6 md:p-10 text-center">
            <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter" style={{ textShadow: '2px 2px 0px black' }}>
              A Sneak Peek Inside
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t-4 border-black">
            {[
              { bg: 'bg-orange-100', icon: '/characters/Wormies - Breakfast.svg', label: 'Math Dash' },
              { bg: 'bg-sky-100', icon: '/characters/Wormies - Space.svg', label: 'Word Pop' },
              { bg: 'bg-purple-100', icon: '/characters/Wormies - Mol.svg', label: 'Memory Match' },
              { bg: 'bg-green-100', icon: '/characters/Wormies - Notes.svg', label: 'AI Stories' },
            ].map((item, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05, y: -10 }} className={`${item.bg} p-6 md:p-10 flex flex-col items-center justify-center gap-3 ${i < 3 ? 'border-r-4 border-black' : ''} ${i < 2 ? 'md:border-r-4' : 'md:border-r-0'} border-b-4 md:border-b-0 border-black cursor-pointer`}>
                <img src={item.icon} alt={item.label} className="h-16 md:h-24 object-contain wormie-base" onError={(e) => (e.currentTarget.style.display = 'none')} />
                <span className="font-black uppercase text-sm md:text-base tracking-widest text-black/70">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 md:py-24 max-w-6xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter text-center mb-4"
          style={{ textShadow: '3px 3px 0px black' }}>
          Everything Your Child Needs
        </motion.h2>
        <p className="text-center text-black/70 font-bold text-lg md:text-xl mb-12 md:mb-16 max-w-xl mx-auto">
          Designed by educators, loved by kids. From math to storytelling, packed into one delightful app.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: <Gamepad2 className="w-10 h-10 text-black" />, color: 'bg-purple-500', title: '8+ Mini-Games', desc: 'Math Dash, Word Jump, Memory Match, Counting, Shapes, Science Quizzes — all designed to teach through play.' },
            { icon: <BookOpen className="w-10 h-10 text-black" />, color: 'bg-blue-400', title: 'AI Story Engine', desc: 'Create personalized storybooks with AI illustrations and voice narration. Every story is unique and kid-safe.' },
            { icon: <Trophy className="w-10 h-10 text-black" />, color: 'bg-amber-400', title: 'Star Rewards', desc: 'Kids earn stars playing games and redeem them for real rewards set by parents. True motivation that works.' },
            { icon: <Shield className="w-10 h-10 text-black" />, color: 'bg-lime-400', title: 'Parent Dashboard', desc: 'PIN-protected parent area with real progress stats, accuracy tracking, and full reward management.' },
            { icon: <Zap className="w-10 h-10 text-black" />, color: 'bg-red-400', title: '3 Difficulty Levels', desc: 'Easy, Medium, and Hard modes that adjust content complexity — grows with your child from age 3 to 12.' },
            { icon: <Heart className="w-10 h-10 text-black" />, color: 'bg-pink-400', title: 'Chore System', desc: 'Assign real-world chores worth stars. Kids mark them done, parents approve — no cheating!' },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }} whileHover={{ y: -6 }}
              className="bg-white border-4 border-black rounded-3xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
              <div className={`${f.color} w-16 h-16 rounded-2xl border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>{f.icon}</div>
              <h3 className="font-black text-xl uppercase tracking-tight">{f.title}</h3>
              <p className="font-bold text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-12 md:py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { n: '200+', l: 'Questions', c: 'bg-white' },
            { n: '8+', l: 'Games', c: 'bg-lime-400' },
            { n: '∞', l: 'AI Stories', c: 'bg-purple-500', w: true },
            { n: '6', l: 'Subjects', c: 'bg-yellow-300' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className={`${s.c} border-4 border-black rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center`}>
              <p className={`text-4xl md:text-6xl font-black ${s.w ? 'text-white' : 'text-black'}`} style={s.w ? { textShadow: '2px 2px 0px black' } : {}}>{s.n}</p>
              <p className={`font-black uppercase tracking-widest text-sm mt-1 ${s.w ? 'text-white/80' : 'text-black/60'}`}>{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Parent Features Highlight */}
      <section className="px-6 py-16 md:py-24 bg-purple-600 border-y-4 md:border-y-[6px] border-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="flex-1 text-white">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6" style={{ textShadow: '3px 3px 0px black' }}>Real Reports. Real Rewards.</h2>
            <p className="text-xl md:text-2xl font-bold text-white/90 mb-8 leading-relaxed">
              Stop guessing if your child is actually learning. The Parent Dashboard gives you total control and visibility.
            </p>
            <ul className="flex flex-col gap-5">
              {[
                { i: <Zap className="w-8 h-8 text-black" />, b: 'Accuracy Reports:', t: 'See exact win/loss ratios for Math, Science, and Language.' },
                { i: <Star className="w-8 h-8 text-black" />, b: 'Custom Rewards:', t: 'You set the prizes. E.g., "1 hour of iPad" = 500 Stars.' },
                { i: <CheckCircle className="w-8 h-8 text-black" />, b: 'Chore Approval:', t: 'Kids mark chores done. You approve them before they get stars.' },
                { i: <Shield className="w-8 h-8 text-black" />, b: 'PIN Protected:', t: 'Kids can\'t access the dashboard, change difficulty, or buy rewards without you.' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 bg-black/20 p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="bg-white p-2 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{item.i}</div>
                  <div>
                    <span className="font-black text-lg block uppercase">{item.b}</span>
                    <span className="font-bold text-white/80">{item.t}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full max-w-sm relative">
            <div className="absolute inset-0 bg-lime-400 rounded-[3rem] rotate-6 border-4 border-black" />
            <div className="bg-white border-4 border-black p-6 rounded-[2.5rem] relative z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
              <div className="text-center pb-4 border-b-4 border-black">
                <h3 className="font-black text-2xl uppercase text-black">Parent Area</h3>
              </div>
              <div className="bg-blue-100 border-2 border-black p-3 rounded-xl">
                <span className="font-black uppercase text-xs">Math Accuracy</span>
                <div className="h-4 bg-white border-2 border-black rounded-full mt-1 overflow-hidden"><div className="w-[85%] h-full bg-blue-500" /></div>
              </div>
              <div className="bg-purple-100 border-2 border-black p-3 rounded-xl">
                <span className="font-black uppercase text-xs">Pending Chores</span>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-sm">Clean Room</span>
                  <button className="bg-lime-400 border-2 border-black px-2 py-1 rounded text-xs font-black uppercase">Approve</button>
                </div>
              </div>
              <div className="bg-amber-100 border-2 border-black p-3 rounded-xl">
                <span className="font-black uppercase text-xs">Manage Store</span>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-sm">Ice Cream Trip</span>
                  <span className="bg-white border-2 border-black px-2 py-1 rounded text-xs font-black">1500 ⭐</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Are Better */}
      <section className="px-6 py-16 md:py-24 max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter text-center mb-12 md:mb-16"
          style={{ textShadow: '3px 3px 0px black' }}>Why Hadoota Is Better</h2>
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="flex-1 bg-white/50 border-4 border-dashed border-gray-400 p-8 rounded-3xl opacity-70">
            <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="flex items-center justify-center w-32 h-32 mb-6 mx-auto">
               <img src="/characters/Wormies - Staying Home.svg" alt="Boring App" className="w-full h-full object-contain opacity-50 grayscale wormie-stroke" />
            </motion.div>
            <h3 className="font-black text-2xl uppercase text-center mb-6 text-gray-500">Other Apps</h3>
            <ul className="flex flex-col gap-4 font-bold text-gray-600">
              <li className="flex gap-2 items-start"><Shield className="w-5 h-5 text-gray-400 shrink-0" /> Boring multiple choice tests disguise as "games"</li>
              <li className="flex gap-2 items-start"><Shield className="w-5 h-5 text-gray-400 shrink-0" /> Virtual coins that buy useless virtual stickers</li>
              <li className="flex gap-2 items-start"><Shield className="w-5 h-5 text-gray-400 shrink-0" /> Generic repetitive questions</li>
              <li className="flex gap-2 items-start"><Shield className="w-5 h-5 text-gray-400 shrink-0" /> Parents have no idea what the kid is learning</li>
            </ul>
          </div>
          <div className="flex-1 bg-lime-400 border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] scale-100 md:scale-110 z-10">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="flex items-center justify-center w-32 h-32 mb-6 mx-auto">
               <img src="/characters/Wormies - Celebration.svg" alt="Hadoota App" className="w-full h-full object-contain wormie-stroke" />
            </motion.div>
            <h3 className="font-black text-3xl uppercase text-center mb-6 text-black" style={{ textShadow: '1px 1px 0px white' }}>Hadoota</h3>
            <ul className="flex flex-col gap-4 font-black">
              <li className="flex gap-3 items-start"><CheckCircle className="w-6 h-6 text-purple-600 shrink-0" /> Fast-paced arcade/puzzle gameplay kids love</li>
              <li className="flex gap-3 items-start"><CheckCircle className="w-6 h-6 text-purple-600 shrink-0" /> Stars buy REAL life rewards (Screen time, toys)</li>
              <li className="flex gap-3 items-start"><CheckCircle className="w-6 h-6 text-purple-600 shrink-0" /> AI-generated, perfectly personalized bedtime stories</li>
              <li className="flex gap-3 items-start"><CheckCircle className="w-6 h-6 text-purple-600 shrink-0" /> Deep parent metrics on accuracy & win-rates</li>
              <li className="flex gap-3 items-start"><CheckCircle className="w-6 h-6 text-purple-600 shrink-0" /> Integrated real-world Chore approval system</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-16 md:py-24 text-center">
        <div className="max-w-2xl mx-auto bg-white border-4 md:border-[6px] border-black rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Get Started Now</h2>
          <p className="text-lg md:text-xl font-bold text-gray-600 mb-8">Set up your family's learning adventure in under 2 minutes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onParentSetup}
              className="bg-black text-white px-8 py-4 rounded-2xl font-black text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 border-4 border-black cursor-pointer">
              <Users className="w-6 h-6" />
              {isParentSetup ? 'Parent Login' : "I'm a Parent"}
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onKidLink}
              className="bg-lime-400 text-black px-8 py-4 rounded-2xl font-black text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-lime-300 transition-colors flex items-center justify-center gap-2 border-4 border-black cursor-pointer">
              <KeyRound className="w-6 h-6" />
              I'm a Kid
            </motion.button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center border-t-4 border-black/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="font-black text-white/80 uppercase tracking-widest text-sm">Hadoota</span>
          </div>
          <p className="font-bold text-black/50 text-sm">
            Made with <Heart className="w-4 h-4 inline text-red-500 fill-red-500" /> for little learners everywhere
          </p>
          <div className="flex gap-4 text-black/50 text-sm font-bold">
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
            <a href="#" className="hover:text-black transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
