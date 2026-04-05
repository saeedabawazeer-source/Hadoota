import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Gamepad2, Trophy, Star, Shield, Heart, Zap, Brain, ArrowRight, Download, Smartphone, CheckCircle } from 'lucide-react';

export function LandingPage({ onTryApp }: { onTryApp: () => void }) {
  return (
    <div className="h-[100dvh] w-full bg-sky-50 font-sans overflow-y-auto overflow-x-hidden selection:bg-lime-400 custom-scrollbar relative">

      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-sky-50/90 backdrop-blur-md border-b-4 border-black/10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50">
              <Sparkles className="w-5 h-5 text-orange-500" />
            </div>
            <span className="font-bold text-xl text-white uppercase tracking-tight" >Hadoota</span>
          </div>
          <div className="flex items-center gap-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onTryApp}
              className="bg-lime-400 border border-slate-200 text-slate-800 px-4 py-2 rounded-full font-bold text-sm uppercase shadow-xl shadow-slate-200/50 hover:bg-lime-300 transition-colors hidden sm:flex items-center gap-1.5">
              Try Web Demo <ArrowRight className="w-4 h-4" />
            </motion.button>
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"
              className="bg-slate-800 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 hover:bg-gray-800 transition-colors border border-slate-200">
              <Download className="w-4 h-4" /> Download
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden">
        {/* Floating decorations */}
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5 }}
          className="absolute top-[12%] left-[8%] w-14 h-14 md:w-20 md:h-20 bg-lime-400 rounded-full border border-slate-200 shadow-xl shadow-slate-200/50 flex items-center justify-center opacity-80">
          <Star className="w-7 h-7 md:w-10 md:h-10 text-slate-800 fill-yellow-300" />
        </motion.div>
        <motion.div animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 6, delay: 1 }}
          className="absolute top-[18%] right-[10%] w-14 h-14 md:w-18 md:h-18 bg-purple-500 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 flex items-center justify-center opacity-80">
          <Brain className="w-7 h-7 md:w-9 md:h-9 text-white" />
        </motion.div>
        <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 7, delay: 2 }}
          className="absolute bottom-[22%] left-[12%] w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 flex items-center justify-center opacity-70">
          <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
        </motion.div>
        <motion.div animate={{ y: [0, 18, 0] }} transition={{ repeat: Infinity, duration: 5.5, delay: 0.5 }}
          className="absolute bottom-[28%] right-[8%] w-14 h-14 md:w-18 md:h-18 bg-yellow-300 rounded-full border border-slate-200 shadow-xl shadow-slate-200/50 flex items-center justify-center opacity-80">
          <Gamepad2 className="w-7 h-7 md:w-9 md:h-9 text-slate-800" />
        </motion.div>

        {/* Logo */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative z-10 bg-white border-4 md:border border-slate-200 p-5 md:p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 md:shadow-xl shadow-slate-200/50 mb-8">
          <Sparkles className="w-14 h-14 md:w-20 md:h-20 text-orange-500" />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="relative z-10 text-5xl md:text-7xl lg:text-8xl font-bold text-white uppercase tracking-tighter leading-[0.9] mb-4"
          >
          Hadoota
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="relative z-10 text-xl md:text-3xl font-bold text-slate-800/80 uppercase tracking-wider mb-2 max-w-lg">
          Where Learning Becomes an Adventure
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="relative z-10 text-base md:text-lg font-bold text-slate-800/60 max-w-md mb-10 leading-relaxed">
          Fun educational games, AI-powered stories, and a reward system that makes kids aged 3-12 excited to learn every single day.
        </motion.p>

        {/* Store Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="relative z-10 flex flex-col sm:flex-row gap-4 items-center">
          <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"
            className="bg-slate-800 border border-slate-200 text-white px-8 py-4 rounded-2xl font-bold text-lg uppercase shadow-xl shadow-slate-200/50 hover:bg-gray-900 transition-colors flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            App Store
          </a>
          <a href="https://play.google.com" target="_blank" rel="noopener noreferrer"
            className="bg-lime-400 border border-slate-200 text-slate-800 px-8 py-4 rounded-2xl font-bold text-lg uppercase shadow-xl shadow-slate-200/50 hover:bg-lime-300 transition-colors flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-black"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.12 12.69l2.578-3.182zM5.864 2.658L16.8 8.99l-2.302 2.302L5.864 2.658z"/></svg>
            Google Play
          </a>
        </motion.div>

        {/* Web demo link */}
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onTryApp}
          className="relative z-10 mt-6 text-white/70 hover:text-white font-bold text-sm uppercase tracking-widest underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors flex items-center gap-2">
          <Smartphone className="w-4 h-4" /> Or try the free web demo →
        </motion.button>
      </header>

      {/* App Preview / Mock */}
      <section className="px-6 py-10 md:py-16 max-w-5xl mx-auto">
        <div className="bg-white border-4 md:border border-slate-200 rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-slate-200/50 md:shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="bg-purple-600 p-6 md:p-10 text-center">
            <h3 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-tighter" >
              A Sneak Peek Inside
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t-4 border-black">
            {[
              { bg: 'bg-orange-100', emoji: '🎮', label: 'Math Dash' },
              { bg: 'bg-sky-100', emoji: '🎈', label: 'Word Pop' },
              { bg: 'bg-purple-100', emoji: '🧠', label: 'Memory Match' },
              { bg: 'bg-green-100', emoji: '📖', label: 'AI Stories' },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} p-6 md:p-10 flex flex-col items-center justify-center gap-3 ${i < 3 ? 'border-r-4 border-black' : ''} ${i < 2 ? 'md:border-r-4' : 'md:border-r-0'} border-b-4 md:border-b-0 border-black`}>
                <span className="text-5xl md:text-7xl">{item.emoji}</span>
                <span className="font-bold uppercase text-sm md:text-base tracking-widest text-slate-800/70">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 md:py-24 max-w-6xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter text-center mb-4"
          >
          Everything Your Child Needs
        </motion.h2>
        <p className="text-center text-slate-800/70 font-bold text-lg md:text-xl mb-12 md:mb-16 max-w-xl mx-auto">
          Designed by educators, loved by kids. From math to storytelling, packed into one delightful app.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: <Gamepad2 className="w-10 h-10 text-slate-800" />, color: 'bg-purple-500', title: '8+ Mini-Games', desc: 'Math Dash, Word Jump, Memory Match, Counting, Shapes, Science Quizzes — all designed to teach through play.' },
            { icon: <BookOpen className="w-10 h-10 text-slate-800" />, color: 'bg-blue-400', title: 'AI Story Engine', desc: 'Create personalized storybooks with AI illustrations and voice narration. Every story is unique and kid-safe.' },
            { icon: <Trophy className="w-10 h-10 text-slate-800" />, color: 'bg-amber-400', title: 'Star Rewards', desc: 'Kids earn stars playing games and redeem them for real rewards set by parents. True motivation that works.' },
            { icon: <Shield className="w-10 h-10 text-slate-800" />, color: 'bg-lime-400', title: 'Parent Dashboard', desc: 'PIN-protected parent area with real progress stats, accuracy tracking, and full reward management.' },
            { icon: <Zap className="w-10 h-10 text-slate-800" />, color: 'bg-red-400', title: '3 Difficulty Levels', desc: 'Easy, Medium, and Hard modes that adjust content complexity — grows with your child from age 3 to 12.' },
            { icon: <Heart className="w-10 h-10 text-slate-800" />, color: 'bg-pink-400', title: 'Chore System', desc: 'Assign real-world chores worth stars. Kids mark them done, parents approve — no cheating!' },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }} whileHover={{ y: -6 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 flex flex-col gap-4">
              <div className={`${f.color} w-16 h-16 rounded-2xl border border-slate-200 flex items-center justify-center shadow-xl shadow-slate-200/50`}>{f.icon}</div>
              <h3 className="font-bold text-xl uppercase tracking-tight">{f.title}</h3>
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
              className={`${s.c} border border-slate-200 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 text-center`}>
              <p className={`text-4xl md:text-6xl font-bold ${s.w ? 'text-white' : 'text-slate-800'}`}>{s.n}</p>
              <p className={`font-bold uppercase tracking-widest text-sm mt-1 ${s.w ? 'text-white/80' : 'text-slate-800/60'}`}>{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Parent Features Highlight */}
      <section className="px-6 py-16 md:py-24 bg-purple-600 border-y-4 md:border border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="flex-1 text-white">
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-6" >Real Reports. Real Rewards.</h2>
            <p className="text-xl md:text-2xl font-bold text-white/90 mb-8 leading-relaxed">
              Stop guessing if your child is actually learning. The Parent Dashboard gives you total control and visibility.
            </p>
            <ul className="flex flex-col gap-5">
              {[
                { i: '📊', b: 'Accuracy Reports:', t: 'See exact win/loss ratios for Math, Science, and Language.' },
                { i: '🎁', b: 'Custom Rewards:', t: 'You set the prizes. E.g., "1 hour of iPad" = 500 Stars.' },
                { i: '🧹', b: 'Chore Approval:', t: 'Kids mark chores done. You approve them before they get stars.' },
                { i: '🔒', b: 'PIN Protected:', t: 'Kids can\'t access the dashboard, change difficulty, or buy rewards without you.' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 bg-slate-800/20 p-4 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
                  <span className="text-3xl">{item.i}</span>
                  <div>
                    <span className="font-bold text-lg block uppercase">{item.b}</span>
                    <span className="font-bold text-white/80">{item.t}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full max-w-sm relative">
            <div className="absolute inset-0 bg-lime-400 rounded-[3rem] rotate-6 border border-slate-200" />
            <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem] relative z-10 shadow-xl shadow-slate-200/50 flex flex-col gap-4">
              <div className="text-center pb-4 border-b-4 border-black">
                <h3 className="font-bold text-2xl uppercase text-slate-800">Parent Area</h3>
              </div>
              <div className="bg-blue-100 border border-slate-200 p-3 rounded-xl">
                <span className="font-bold uppercase text-xs">Math Accuracy</span>
                <div className="h-4 bg-white border border-slate-200 rounded-full mt-1 overflow-hidden"><div className="w-[85%] h-full bg-blue-500" /></div>
              </div>
              <div className="bg-purple-100 border border-slate-200 p-3 rounded-xl">
                <span className="font-bold uppercase text-xs">Pending Chores</span>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-sm">Clean Room</span>
                  <button className="bg-lime-400 border border-slate-200 px-2 py-1 rounded text-xs font-bold uppercase">Approve</button>
                </div>
              </div>
              <div className="bg-amber-100 border border-slate-200 p-3 rounded-xl">
                <span className="font-bold uppercase text-xs">Manage Store</span>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-sm">Ice Cream Trip</span>
                  <span className="bg-white border border-slate-200 px-2 py-1 rounded text-xs font-bold">1500 ⭐</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Are Better */}
      <section className="px-6 py-16 md:py-24 max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter text-center mb-12 md:mb-16"
          >Why Hadoota Is Better</h2>
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="flex-1 bg-white/50 border-4 border-dashed border-gray-400 p-8 rounded-3xl opacity-70">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-200 border-4 border-gray-400 rounded-2xl mb-6 mx-auto"><span className="text-3xl">🥱</span></div>
            <h3 className="font-bold text-2xl uppercase text-center mb-6 text-gray-500">Other Apps</h3>
            <ul className="flex flex-col gap-4 font-bold text-gray-600">
              <li className="flex gap-2"><span>❌</span> Boring multiple choice tests disguise as "games"</li>
              <li className="flex gap-2"><span>❌</span> Virtual coins that buy useless virtual stickers</li>
              <li className="flex gap-2"><span>❌</span> Generic repetitive questions</li>
              <li className="flex gap-2"><span>❌</span> Parents have no idea what the kid is learning</li>
            </ul>
          </div>
          <div className="flex-1 bg-lime-400 border border-slate-200 p-8 rounded-3xl shadow-xl shadow-slate-200/50 scale-100 md:scale-110 z-10">
            <div className="flex items-center justify-center w-16 h-16 bg-white border border-slate-200 rounded-2xl mb-6 shadow-xl shadow-slate-200/50 mx-auto"><Sparkles className="w-8 h-8 text-orange-500" /></div>
            <h3 className="font-bold text-3xl uppercase text-center mb-6 text-slate-800" >Hadoota</h3>
            <ul className="flex flex-col gap-4 font-bold">
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
        <div className="max-w-2xl mx-auto bg-white border-4 md:border border-slate-200 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 shadow-xl shadow-slate-200/50 md:shadow-xl shadow-slate-200/50">
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-4">Download Hadoota Today</h2>
          <p className="text-lg md:text-xl font-bold text-gray-600 mb-8">Free to download. Start your child's learning adventure now.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"
              className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-lg uppercase shadow-xl shadow-slate-200/50 hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 border border-slate-200">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              App Store
            </a>
            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer"
              className="bg-lime-400 text-slate-800 px-8 py-4 rounded-2xl font-bold text-lg uppercase shadow-xl shadow-slate-200/50 hover:bg-lime-300 transition-colors flex items-center justify-center gap-2 border border-slate-200">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-black"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.12 12.69l2.578-3.182zM5.864 2.658L16.8 8.99l-2.302 2.302L5.864 2.658z"/></svg>
              Google Play
            </a>
          </div>
          <button onClick={onTryApp}
            className="mt-6 text-gray-500 hover:text-gray-700 font-bold text-sm uppercase tracking-widest underline underline-offset-4 transition-colors">
            Or try the free web demo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center border-t-4 border-black/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="font-bold text-white/80 uppercase tracking-widest text-sm">Hadoota</span>
          </div>
          <p className="font-bold text-slate-800/50 text-sm">
            Made with <Heart className="w-4 h-4 inline text-red-500 fill-red-500" /> for little learners everywhere
          </p>
          <div className="flex gap-4 text-slate-800/50 text-sm font-bold">
            <a href="#" className="hover:text-slate-800 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
