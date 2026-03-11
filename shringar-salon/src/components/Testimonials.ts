export function Testimonials() {
    const testimonials = [
        { name: 'Priya S.', role: 'Salon Client', content: 'The bridal makeup by Madhu was exactly what I dreamed of. Everyone loved it!' },
        { name: 'Anjali K.', role: 'Academy Student', content: 'The basic course gave me the confidence to start my own home salon. Highly recommended!' },
        { name: 'Sneha R.', role: 'Salon Client', content: 'Best facial treatment in the city. My skin feels so refreshed.' },
    ];

    return `
    <section class="py-20">
      <div class="container text-center mb-12">
        <h2 class="serif text-3xl mb-4">What Our Clients Say</h2>
      </div>
      <div class="container grid grid-cols-1 md:grid-cols-3 gap-8">
        ${testimonials.map(t => `
          <div class="bg-white p-8 rounded-lg shadow-sm border border-soft-cream relative">
            <div class="text-rose-gold text-4xl mb-4">“</div>
            <p class="mb-6 italic">"${t.content}"</p>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-rose-gold rounded-full flex items-center justify-center text-white font-bold">
                ${t.name.charAt(0)}
              </div>
              <div>
                <p class="font-bold text-sm">${t.name}</p>
                <p class="text-xs opacity-60">${t.role}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}
