document.addEventListener('DOMContentLoaded', function () {
  if (document.body.dataset.page === 'custom-order') {
    const form = document.getElementById('custom-order-form');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const payload = {
        id: `CR-${Date.now()}`,
        fullName: document.getElementById('custom-name').value.trim(),
        phone: document.getElementById('custom-phone').value.trim(),
        email: document.getElementById('custom-email').value.trim(),
        productType: document.getElementById('custom-product-type').value,
        size: document.getElementById('custom-size').value,
        colors: document.getElementById('custom-colors').value,
        customText: document.getElementById('custom-text').value.trim(),
        description: document.getElementById('custom-description').value.trim(),
        budget: document.getElementById('custom-budget').value,
        reference: document.getElementById('custom-reference').value.trim(),
        status: 'New',
        createdAt: new Date().toISOString()
      };
      const customOrders = JSON.parse(localStorage.getItem(ResinArt.STORAGE_KEYS.customOrders) || '[]');
      customOrders.push(payload);
      localStorage.setItem(ResinArt.STORAGE_KEYS.customOrders, JSON.stringify(customOrders));
      form.reset();
      ResinArt.showToast('Custom request submitted', 'success');
    });
  }

  if (document.body.dataset.page === 'contact') {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const payload = {
        id: `MSG-${Date.now()}`,
        name: document.getElementById('contact-name').value.trim(),
        email: document.getElementById('contact-email').value.trim(),
        phone: document.getElementById('contact-phone').value.trim(),
        message: document.getElementById('contact-message').value.trim(),
        date: new Date().toISOString(),
        read: false
      };
      const messages = JSON.parse(localStorage.getItem(ResinArt.STORAGE_KEYS.contactMessages) || '[]');
      messages.push(payload);
      localStorage.setItem(ResinArt.STORAGE_KEYS.contactMessages, JSON.stringify(messages));
      form.reset();
      ResinArt.showToast('Message sent successfully', 'success');
    });
  }
});
