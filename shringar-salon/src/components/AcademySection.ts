export function AcademySection() {
    const courses = [
        { title: 'Basic Beautician Course', duration: '3 Months', certification: 'Professional' },
        { title: 'Advanced Makeup Artistry', duration: '2 Months', certification: 'Expert' },
        { title: 'Professional Hair Styling', duration: '1 Month', certification: 'Pro' },
    ];

    return `
    <section id="academy" class="py-20 bg-white">
      <div class="container text-center mb-10">
        <h2 class="serif text-3xl mb-4">Shringar Beauty Academy</h2>
        <p class="text-charcoal opacity-70">Learn from Mrs. Madhuri and start your professional career.</p>
      </div>
      <div class="container grid grid-cols-1 md:grid-cols-3 gap-8">
        ${courses.map(course => `
          <div class="p-8 border border-soft-cream rounded-lg bg-soft-cream text-charcoal">
            <h3 class="serif text-2xl mb-4">${course.title}</h3>
            <ul class="mb-6 space-y-2">
              <li><strong>Duration:</strong> ${course.duration}</li>
              <li><strong>Certification:</strong> ${course.certification}</li>
            </ul>
            <a href="#enroll" class="btn btn-primary w-full text-center">Enroll Now</a>
          </div>
        `).join('')}
      </div>
      <div class="container text-center mt-12">
        <button class="btn btn-secondary">Download Academy Brochure (PDF)</button>
      </div>
    </section>
  `;
}
