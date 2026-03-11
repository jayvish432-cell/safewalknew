export function ExpertProfile() {
    return `
    <section id="about" class="py-20 bg-soft-cream">
      <div class="container grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        <div class="relative">
          <div class="rounded-lg overflow-hidden shadow-xl border-4 border-white">
            <img src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=800" alt="Mrs. Madhuri" class="w-full h-auto grayscale hover:grayscale-0 transition duration-500">
          </div>
          <div class="absolute -bottom-6 -right-6 bg-rose-gold text-white p-6 rounded-lg shadow-lg">
            <p class="serif text-2xl">15+ Years</p>
            <p class="text-xs uppercase tracking-widest">Experience</p>
          </div>
        </div>
        <div>
          <h2 class="serif text-4xl mb-6">Meet Mrs. Madhuri (Madhu)</h2>
          <p class="mb-4">With over 15 years of experience in the beauty industry, Mrs. Madhuri has transformed thousands of looks and mentored hundreds of aspiring beauticians.</p>
          <p class="mb-6 italic">"Beauty is not just about looking good; it's about feeling confident and empowered. At Shringar, we bring out the best in you."</p>
          <div class="flex gap-4">
             <div class="border-l-4 border-rose-gold pl-4">
                <p class="font-bold">Bridal Expert</p>
                <p class="text-sm">Specialized in Traditional & Modern Bridal Looks</p>
             </div>
             <div class="border-l-4 border-rose-gold pl-4">
                <p class="font-bold">Lead Educator</p>
                <p class="text-sm">Founder of Shringar Beauty Academy</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
