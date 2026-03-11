export function AppointmentForm() {
    return `
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
  `;
}

export function setupFormLogic() {
    const form = document.querySelector<HTMLFormElement>('#lead-form');
    const successMsg = document.querySelector<HTMLDivElement>('#form-success');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = (document.querySelector('#name') as HTMLInputElement).value;
            const phone = (document.querySelector('#phone') as HTMLInputElement).value;
            const interest = (document.querySelector('#interest') as HTMLSelectElement).value;
            const message = (document.querySelector('#message') as HTMLTextAreaElement).value;

            const Inquiry = { name, phone, interest, message, date: new Date().toISOString() };

            const inquiries = JSON.parse(localStorage.getItem('shringar_inquiries') || '[]');
            inquiries.push(Inquiry);
            localStorage.setItem('shringar_inquiries', JSON.stringify(inquiries));

            form.style.display = 'none';
            if (successMsg) successMsg.classList.remove('hidden');
        });
    }
}
