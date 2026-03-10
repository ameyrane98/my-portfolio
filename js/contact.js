export function initContact() {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitButton');
  const successMsg = document.getElementById('successMessage');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';

    try {
      const res  = await fetch(form.action, { method: 'POST', body: new FormData(form) });
      const data = await res.json();

      if (data.success) {
        successMsg.hidden = false;
        form.reset();
        // Scroll success message into view
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch {
      alert('Error submitting form. Please try again later.');
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}
