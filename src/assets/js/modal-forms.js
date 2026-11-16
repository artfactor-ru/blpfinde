(function () {
    'use strict';
    if (window.blpModalForms) return;

    const routes = [
        ['.header__btn, .technology__btn.color-btn, .footer-btn.color-btn, .tasks__btn.color-btn, .cases__btn.color-btn', '.form-solution'],
        ['.main-about__btn.color-btn, .uniqueness__btn.color-btn', '.form-question'],
        ['.consultants__btn.color-btn, .certificate-benefits__btn.color-btn', '.form-materials'],
        ['.certificate-benefits__btn.not-color-btn, .form-materials .registration-link', '.form-authorization'],
        ['.bid-btn', '.form-bid']
    ];
    const selectors = ['.form-solution', '.form-question', '.form-materials', '.form-authorization', '.form-bid', '.form-registration'];
    let active = null;
    let overlay = null;
    let pending = null;
    let observer = null;
    let scrollY = 0;
    let padding = '';
    let alreadyLocked = false;
    let returnFocus = null;

    function stopWaiting() {
        pending = null;
        if (observer) observer.disconnect();
        observer = null;
    }

    function show() {
        if (!pending) return false;
        const next = document.querySelector(pending);
        const backdrop = document.querySelector('.overlay');
        if (!next || !backdrop) return false;
        if (!active) {
            const root = document.documentElement;
            scrollY = window.scrollY;
            padding = root.style.paddingRight;
            alreadyLocked = root.classList.contains('modal-open');
            const width = window.innerWidth - root.clientWidth;
            root.classList.add('modal-open');
            if (!alreadyLocked && width > 0) root.style.paddingRight = width + 'px';
        } else if (active !== next) {
            active.classList.remove('active');
        }
        active = next;
        overlay = backdrop;
        active.classList.add('active');
        overlay.classList.add('active');
        stopWaiting();
        return true;
    }

    function open(selector, trigger) {
        if (!selectors.includes(selector)) return false;
        if (!active && trigger) {
            returnFocus = trigger.matches('a, button') ? trigger : trigger.querySelector('a, button');
        }
        pending = selector;
        if (!show() && !observer) {
            observer = new MutationObserver(show);
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
        return true;
    }

    function close() {
        stopWaiting();
        if (!active) return;
        active.classList.remove('active');
        overlay.classList.remove('active');
        if (!alreadyLocked) document.documentElement.classList.remove('modal-open');
        document.documentElement.style.paddingRight = padding;
        window.scrollTo(0, scrollY);
        active = null;
        if (returnFocus && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
        returnFocus = null;
    }

    document.addEventListener('click', function (event) {
        const target = event.target instanceof Element ? event.target : null;
        if (!target) return;

        const screenLink = target.closest('#show-restore, #show-login');
        if (screenLink) {
            const login = document.getElementById('screen-login');
            const restore = document.getElementById('screen-restore');
            if (login && restore) {
                event.preventDefault();
                const restoring = screenLink.id === 'show-restore';
                login.style.display = restoring ? 'none' : 'block';
                restore.style.display = restoring ? 'block' : 'none';
            }
            return;
        }

        const registration = target.closest('.form-authorization .registration-link');
        if (registration) {
            event.preventDefault();
            open(document.querySelector('.form-registration') ? '.form-registration' : '.form-materials', registration);
            return;
        }
        const explicit = target.closest('[data-modal-open]');
        if (explicit && open(explicit.getAttribute('data-modal-open'), explicit)) {
            event.preventDefault();
            return;
        }
        for (const [buttons, selector] of routes) {
            const trigger = target.closest(buttons);
            if (trigger) {
                event.preventDefault();
                open(selector, trigger);
                return;
            }
        }
        if (active && (target === overlay ||
            (active.contains(target) && target.closest('.modal-form__close')))) {
            event.preventDefault();
            close();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && (active || pending)) {
            event.preventDefault();
            close();
        }
    });
    document.addEventListener('DOMContentLoaded', function () {
        show();
        stopWaiting();
    }, { once: true });

    window.blpModalForms = { open, close };
    if (new URLSearchParams(window.location.search).get('login') === '1') {
        open('.form-authorization');
    }
}());
