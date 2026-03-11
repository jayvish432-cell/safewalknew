export function ServiceGrid() {
    const services = [
        { title: 'Hair Styling', description: 'Expert cuts, colors, and treatments.', price: 'Starting ₹500' },
        { title: 'Skincare', description: 'Facials, peels, and rejuvenation.', price: 'Starting ₹800' },
        { title: 'Bridal Makeup', description: 'Stunning looks for your special day.', price: 'Starting ₹5000' },
        { title: 'Spa & Wellness', description: 'Relaxing massages and body treatments.', price: 'Starting ₹1200' },
    ];

    return `
    <section id="salon" class="py-20">
      <div class="container text-center mb-10">
        <h2 class="serif text-3xl mb-4">Our Salon Services</h2>
        <p class="text-charcoal opacity-70">Expert beauty solutions tailored for you.</p>
      </div>
      <div class="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        ${services.map(service => `
          <div class="bg-white p-6 rounded-lg shadow-sm border border-soft-cream hover:border-rose-gold transition">
            <h3 class="serif text-xl mb-2">${service.title}</h3>
            <p class="text-sm mb-4">${service.description}</p>
            <span class="text-rose-gold font-bold">${service.price}</span>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}
