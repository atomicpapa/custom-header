import { haElem } from './ha-elements';

export const menuButtonObservers = (config, header) => {
  if (config.menu_hide) return;
  // Create Notification Dot
  const buildDot = () => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.style.cssText = `
        pointer-events: none;
        position: relative;
        background-color: ${config.notification_dot_color};
        width: 12px;
        height: 12px;
        top: -28px;
        right: ${config.reverse_button_direction ? '' : '-'}16px;
        border-radius: 50%;
    `;
    return dot;
  };

  const menuButtonVisibility = () => {
    if (config.disable_sidebar || window.customHeaderDisabled) return;
    if (haElem.menu.style.visibility === 'hidden') header.menu.style.display = 'none';
    else header.menu.style.display = 'initial';
  };

  const notificationDot = mutations => {
    const root = document
      .querySelector('home-assistant')
      .shadowRoot.querySelector('home-assistant-main')
      .shadowRoot.querySelector('ha-panel-lovelace')
      .shadowRoot.querySelector('hui-root');
    mutations.forEach(({ addedNodes, removedNodes }) => {
      if (addedNodes) {
        for (const node of addedNodes) {
          if (
            node.className === 'dot' &&
            !root.shadowRoot.querySelector('[buttonElem="menu"]').shadowRoot.querySelector('.dot')
          ) {
            root.shadowRoot.querySelector('[buttonElem="menu"]').shadowRoot.appendChild(buildDot());
            if (root.shadowRoot.querySelector('[buttonElem="menu"]').shadowRoot.querySelector('.buttonText')) {
              root.shadowRoot.querySelector('[buttonElem="menu"]').shadowRoot.querySelector('.dot').style.display = 'none';
              root.shadowRoot
                .querySelector('[buttonElem="menu"]')
                .shadowRoot.querySelector(
                  '.buttonText',
                ).style.borderBottom = `3px solid ${window.customHeaderConfig.notification_dot_color}`;
            }
          }
        }
      }
      if (removedNodes) {
        for (const node of removedNodes) {
          if (
            node.className === 'dot' &&
            root.shadowRoot.querySelector('[buttonElem="menu"]').shadowRoot.querySelector('.dot')
          ) {
            root.shadowRoot
              .querySelector('[buttonElem="menu"]')
              .shadowRoot.querySelector('.dot')
              .remove();
            if (root.shadowRoot.querySelector('[buttonElem="menu"]').shadowRoot.querySelector('.buttonText')) {
              root.shadowRoot
                .querySelector('[buttonElem="menu"]')
                .shadowRoot.querySelector('.buttonText').style.borderBottom = '';
            }
          }
        }
      }
    });
  };

  if (!window.customHeaderMenuObserver) {
    window.customHeaderMenuObserver = true;
    const notificationObserver = new MutationObserver(notificationDot);
    notificationObserver.observe(haElem.menu.shadowRoot, { childList: true });

    const menuButtonObserver = new MutationObserver(menuButtonVisibility);
    menuButtonObserver.observe(haElem.menu, { attributes: true, attributeFilter: ['style'] });
  }

  menuButtonVisibility();

  const prevDot = header.menu.shadowRoot.querySelector('.dot');
  if (prevDot && prevDot.style.cssText != buildDot().style.cssText) {
    prevDot.remove();
    if (config.button_text.menu) {
      header.menu.shadowRoot.querySelector('.buttonText').style.textDecoration = '';
    }
  }
  if (!header.menu.shadowRoot.querySelector('.dot') && haElem.menu.shadowRoot.querySelector('.dot')) {
    header.menu.shadowRoot.appendChild(buildDot());
    if (config.button_text.menu) {
      header.menu.shadowRoot.querySelector('.dot').style.display = 'none';
      header.menu.shadowRoot.querySelector(
        '.buttonText',
      ).style.borderBottom = `3px solid ${config.notification_dot_color}`;
    }
  }
};
