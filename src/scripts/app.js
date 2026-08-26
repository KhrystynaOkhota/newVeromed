class Navigation {
  constructor() {
    this.burgerBtn = document.getElementById('burgerToggle');
    this.closeBtn = document.getElementById('dialogClose');
    this.dialog = document.getElementById('mobileDialog');

    if (this.dialog && this.burgerBtn) {
      this.initModal();
    }

    this.initSubMenus();
  }

  initModal() {
    // Відкриття
    this.burgerBtn.addEventListener('click', () => {
      this.dialog.showModal();
      this.burgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Блокуємо скрол фону
    });

    // Закриття через Х
    this.closeBtn?.addEventListener('click', () => this.closeDialog());

    // Клік по backdrop (поза межами внутрішнього контенту)
    this.dialog.addEventListener('click', (e) => {
      if (e.target === this.dialog) {
        this.closeDialog();
      }
    });

    // Подія 'close' спрацьовує і при звичайному закритті, і при натисканні ESC
    this.dialog.addEventListener('close', () => {
      this.burgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = ''; // Відновлюємо скрол фону
    });
  }

  closeDialog() {
    this.dialog.close();
  }

  initSubMenus() {
    const parentItems = document.querySelectorAll('#menu-mobile .menu-item-has-children');

    parentItems.forEach((item) => {
      let toggleBtn = item.querySelector('.sub-menu-toggle');
      const subMenu = item.querySelector('.sub-menu');

      if (!subMenu) return;

      // Якщо WP не згенерував кнопку тоглу поруч з посиланням — створюємо її автоматично
      if (!toggleBtn) {
        toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'sub-menu-toggle';
        toggleBtn.setAttribute('aria-label', 'Розгорнути підменю');
        toggleBtn.setAttribute('aria-expanded', 'false');
        
        // Вставляємо кнопку після посилання <a> перед <ul>.sub-menu
        item.insertBefore(toggleBtn, subMenu);
      }

      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';

        toggleBtn.setAttribute('aria-expanded', (!isExpanded).toString());
        subMenu.classList.toggle('is-open', !isExpanded);
        item.classList.toggle('is-active', !isExpanded);
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
});