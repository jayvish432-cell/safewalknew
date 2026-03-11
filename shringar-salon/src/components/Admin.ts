export function AdminDashboard() {
    const inquiries = JSON.parse(localStorage.getItem('shringar_inquiries') || '[]');

    return `
    <div id="admin-view" class="hidden fixed inset-0 bg-white z-[2000] overflow-y-auto p-8">
      <div class="container">
        <div class="flex justify-between items-center mb-8">
          <h2 class="serif text-3xl">Inquiry Dashboard</h2>
          <button id="close-admin" class="btn btn-secondary">Close Dashboard</button>
        </div>
        
        ${inquiries.length === 0 ? '<p>No inquiries yet.</p>' : `
          <div class="space-y-4">
            ${inquiries.map((iq: any) => `
              <div class="border p-4 rounded-lg bg-soft-cream">
                <div class="flex justify-between mb-2">
                  <p class="font-bold">${iq.name}</p>
                  <p class="text-xs opacity-50">${new Date(iq.date).toLocaleString()}</p>
                </div>
                <p class="text-sm"><strong>Phone:</strong> ${iq.phone}</p>
                <p class="text-sm"><strong>Interest:</strong> ${iq.interest === 'salon' ? 'Salon Booking' : 'Academy Enrollment'}</p>
                <p class="text-sm mt-2"><strong>Message:</strong> ${iq.message}</p>
              </div>
            `).reverse().join('')}
          </div>
        `}
      </div>
    </div>
  `;
}

export function setupAdminLogic() {
    const closeBtn = document.querySelector<HTMLButtonElement>('#close-admin');
    const adminView = document.querySelector<HTMLDivElement>('#admin-view');

    // Secret triple click on logo to open admin
    const logo = document.querySelector<HTMLAnchorElement>('.logo');
    let clickCount = 0;

    if (logo && adminView) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            clickCount++;
            if (clickCount === 3) {
                adminView.classList.remove('hidden');
                clickCount = 0;
            }
            setTimeout(() => { clickCount = 0; }, 1000);
        });
    }

    if (closeBtn && adminView) {
        closeBtn.addEventListener('click', () => {
            adminView.classList.add('hidden');
        });
    }
}
