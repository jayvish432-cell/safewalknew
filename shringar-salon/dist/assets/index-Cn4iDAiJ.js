(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function i(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(t){if(t.ep)return;t.ep=!0;const r=i(t);fetch(t.href,r)}})();function c(){return`
    <header>
      <div class="container nav-content">
        <a href="/" class="logo serif">Shringar</a>
        <nav class="nav-links">
          <a href="#salon">Salon</a>
          <a href="#academy">Academy</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  `}function d(){return`
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <h1 class="serif">Shringar Beauty Salon & Academy</h1>
        <p>Expertise by Mrs. Madhuri — Transform your look, start your career.</p>
        <div class="cta-buttons">
          <a href="#salon" class="btn btn-primary">Book a Transformation</a>
          <a href="#academy" class="btn btn-secondary">Start Your Career</a>
        </div>
      </div>
    </section>
  `}function u(){return`
    <section id="salon" class="py-20">
      <div class="container text-center mb-10">
        <h2 class="serif text-3xl mb-4">Our Salon Services</h2>
        <p class="text-charcoal opacity-70">Expert beauty solutions tailored for you.</p>
      </div>
      <div class="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        ${[{title:"Hair Styling",description:"Expert cuts, colors, and treatments.",price:"Starting ₹500"},{title:"Skincare",description:"Facials, peels, and rejuvenation.",price:"Starting ₹800"},{title:"Bridal Makeup",description:"Stunning looks for your special day.",price:"Starting ₹5000"},{title:"Spa & Wellness",description:"Relaxing massages and body treatments.",price:"Starting ₹1200"}].map(e=>`
          <div class="bg-white p-6 rounded-lg shadow-sm border border-soft-cream hover:border-rose-gold transition">
            <h3 class="serif text-xl mb-2">${e.title}</h3>
            <p class="text-sm mb-4">${e.description}</p>
            <span class="text-rose-gold font-bold">${e.price}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `}function m(){return`
    <section id="academy" class="py-20 bg-white">
      <div class="container text-center mb-10">
        <h2 class="serif text-3xl mb-4">Shringar Beauty Academy</h2>
        <p class="text-charcoal opacity-70">Learn from Mrs. Madhuri and start your professional career.</p>
      </div>
      <div class="container grid grid-cols-1 md:grid-cols-3 gap-8">
        ${[{title:"Basic Beautician Course",duration:"3 Months",certification:"Professional"},{title:"Advanced Makeup Artistry",duration:"2 Months",certification:"Expert"},{title:"Professional Hair Styling",duration:"1 Month",certification:"Pro"}].map(e=>`
          <div class="p-8 border border-soft-cream rounded-lg bg-soft-cream text-charcoal">
            <h3 class="serif text-2xl mb-4">${e.title}</h3>
            <ul class="mb-6 space-y-2">
              <li><strong>Duration:</strong> ${e.duration}</li>
              <li><strong>Certification:</strong> ${e.certification}</li>
            </ul>
            <a href="#enroll" class="btn btn-primary w-full text-center">Enroll Now</a>
          </div>
        `).join("")}
      </div>
      <div class="container text-center mt-12">
        <button class="btn btn-secondary">Download Academy Brochure (PDF)</button>
      </div>
    </section>
  `}function p(){return`
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
  `}function f(){return`
    <section class="py-20">
      <div class="container text-center mb-12">
        <h2 class="serif text-3xl mb-4">What Our Clients Say</h2>
      </div>
      <div class="container grid grid-cols-1 md:grid-cols-3 gap-8">
        ${[{name:"Priya S.",role:"Salon Client",content:"The bridal makeup by Madhu was exactly what I dreamed of. Everyone loved it!"},{name:"Anjali K.",role:"Academy Student",content:"The basic course gave me the confidence to start my own home salon. Highly recommended!"},{name:"Sneha R.",role:"Salon Client",content:"Best facial treatment in the city. My skin feels so refreshed."}].map(e=>`
          <div class="bg-white p-8 rounded-lg shadow-sm border border-soft-cream relative">
            <div class="text-rose-gold text-4xl mb-4">“</div>
            <p class="mb-6 italic">"${e.content}"</p>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-rose-gold rounded-full flex items-center justify-center text-white font-bold">
                ${e.name.charAt(0)}
              </div>
              <div>
                <p class="font-bold text-sm">${e.name}</p>
                <p class="text-xs opacity-60">${e.role}</p>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `}function g(){return`
    <div id="enroll" class="bg-white p-8 rounded-lg shadow-lg border border-rose-gold/20">
      <h3 class="serif text-2xl mb-6 text-center">Book an Appointment / Enroll Now</h3>
      <form id="lead-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Full Name</label>
          <input type="text" id="name" required class="w-full p-2 border border-soft-cream rounded focus:outline-none focus:border-rose-gold">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Phone Number</label>
          <input type="tel" id="phone" required class="w-full p-2 border border-soft-cream rounded focus:outline-none focus:border-rose-gold">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Interest</label>
          <select id="interest" class="w-full p-2 border border-soft-cream rounded focus:outline-none focus:border-rose-gold">
            <option value="salon">Salon Service (Booking)</option>
            <option value="academy">Academy Course (Enrollment)</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Message</label>
          <textarea id="message" rows="3" class="w-full p-2 border border-soft-cream rounded focus:outline-none focus:border-rose-gold"></textarea>
        </div>
        <button type="submit" class="btn btn-primary w-full">Submit Inquiry</button>
      </form>
      <div id="form-success" class="hidden mt-4 p-4 bg-green-50 text-green-700 rounded text-center">
        Thank you! We will contact you shortly.
      </div>
    </div>
  `}function h(){const s=document.querySelector("#lead-form"),e=document.querySelector("#form-success");s&&s.addEventListener("submit",i=>{i.preventDefault();const o=document.querySelector("#name").value,t=document.querySelector("#phone").value,r=document.querySelector("#interest").value,a=document.querySelector("#message").value,l={name:o,phone:t,interest:r,message:a,date:new Date().toISOString()},n=JSON.parse(localStorage.getItem("shringar_inquiries")||"[]");n.push(l),localStorage.setItem("shringar_inquiries",JSON.stringify(n)),s.style.display="none",e&&e.classList.remove("hidden")})}function b(){const s=JSON.parse(localStorage.getItem("shringar_inquiries")||"[]");return`
    <div id="admin-view" class="hidden fixed inset-0 bg-white z-[2000] overflow-y-auto p-8">
      <div class="container">
        <div class="flex justify-between items-center mb-8">
          <h2 class="serif text-3xl">Inquiry Dashboard</h2>
          <button id="close-admin" class="btn btn-secondary">Close Dashboard</button>
        </div>
        
        ${s.length===0?"<p>No inquiries yet.</p>":`
          <div class="space-y-4">
            ${s.map(e=>`
              <div class="border p-4 rounded-lg bg-soft-cream">
                <div class="flex justify-between mb-2">
                  <p class="font-bold">${e.name}</p>
                  <p class="text-xs opacity-50">${new Date(e.date).toLocaleString()}</p>
                </div>
                <p class="text-sm"><strong>Phone:</strong> ${e.phone}</p>
                <p class="text-sm"><strong>Interest:</strong> ${e.interest==="salon"?"Salon Booking":"Academy Enrollment"}</p>
                <p class="text-sm mt-2"><strong>Message:</strong> ${e.message}</p>
              </div>
            `).reverse().join("")}
          </div>
        `}
      </div>
    </div>
  `}function v(){const s=document.querySelector("#close-admin"),e=document.querySelector("#admin-view"),i=document.querySelector(".logo");let o=0;i&&e&&i.addEventListener("click",t=>{t.preventDefault(),o++,o===3&&(e.classList.remove("hidden"),o=0),setTimeout(()=>{o=0},1e3)}),s&&e&&s.addEventListener("click",()=>{e.classList.add("hidden")})}const y=document.querySelector("#app");y.innerHTML=`
  ${c()}
  <main>
    ${d()}
    ${u()}
    ${m()}
    
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

    ${p()}
    ${f()}
    
    <section id="contact" class="py-20">
      <div class="container max-width-600">
        ${g()}
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

  ${b()}
`;h();v();
