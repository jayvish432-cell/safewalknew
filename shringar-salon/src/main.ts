import './style.css';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServiceGrid } from './components/ServiceGrid';
import { AcademySection } from './components/AcademySection';
import { ExpertProfile } from './components/ExpertProfile';
import { Testimonials } from './components/Testimonials';
import { AppointmentForm, setupFormLogic } from './components/Forms';
import { AdminDashboard, setupAdminLogic } from './components/Admin';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  ${Navbar()}
  <main>
    ${Hero()}
    ${ServiceGrid()}
    ${AcademySection()}
    
    <section id="gallery" class="py-20 bg-white">
      <div class="container text-center mb-10">
        <h2 class="serif text-3xl mb-4">Transformations Gallery</h2>
        <p class="text-charcoal opacity-70">A glimpse into our signature bridal and salon work.</p>
      </div>
      <div class="container grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="rounded-lg overflow-hidden h-64 bg-soft-cream flex items-center justify-center border border-rose-gold/20">
          <p class="serif text-xl opacity-40">Before / After Slider 1</p>
        </div>
        <div class="rounded-lg overflow-hidden h-64 bg-soft-cream flex items-center justify-center border border-rose-gold/20">
          <p class="serif text-xl opacity-40">Before / After Slider 2</p>
        </div>
      </div>
    </section>

    ${ExpertProfile()}
    ${Testimonials()}
    
    <section id="contact" class="py-20">
      <div class="container max-width-600">
        ${AppointmentForm()}
      </div>
    </section>
  </main>
  
  <footer class="bg-charcoal text-white py-12">
    <div class="container text-center">
      <h2 class="serif text-2xl mb-2">Shringar Beauty Salon & Academy</h2>
      <p class="mb-6 opacity-60">Owned by Mrs. Madhuri (Madhu)</p>
      <div class="flex justify-center gap-6 mb-8">
        <a href="#" class="text-white hover:text-rose-gold transition">Instagram</a>
        <a href="#" class="text-white hover:text-rose-gold transition">Facebook</a>
        <a href="#" class="text-white hover:text-rose-gold transition">WhatsApp</a>
      </div>
      <p class="text-xs opacity-40">© 2024 Shringar Salon & Academy. All rights reserved.</p>
      <p class="text-[8px] opacity-10 mt-4 leading-none">Secret: Triple click Logo for Admin</p>
    </div>
  </footer>

  <a href="https://wa.me/919999999999" class="whatsapp-btn shadow-lg" target="_blank">
    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width="30">
  </a>

  ${AdminDashboard()}
`;

setupFormLogic();
setupAdminLogic();
