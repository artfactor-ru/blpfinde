export function initMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const burgerBtns = document.querySelectorAll('.header__burger');

    if (!burgerBtns.length || !mobileMenu) {
        return;
    }

    let isMobileMenuOpen = false;
    let activeBurgerBtn = null;
    let dropdownsInitialized = false;
    let scrollbarWidth = 0;

    function calculateScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }

    function disableBodyScroll() {
        scrollbarWidth = calculateScrollbarWidth();

        const scrollY = window.scrollY;
        document.documentElement.classList.add('modal-open');

        if (scrollbarWidth > 0) {
            document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
        }

        document.documentElement.dataset.scrollY = scrollY;
    }

    function enableBodyScroll() {
        const scrollY = document.documentElement.dataset.scrollY;
        document.documentElement.classList.remove('modal-open');
        document.documentElement.style.paddingRight = '';

        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY));
            delete document.documentElement.dataset.scrollY;
        }
    }

    function openMobileMenu(clickedBtn) {
        disableBodyScroll();
        mobileMenu.classList.add('active');
        isMobileMenuOpen = true;
        activeBurgerBtn = clickedBtn;

        clickedBtn.classList.add('is-open');

        burgerBtns.forEach(btn => {
            if (btn !== clickedBtn) {
                btn.classList.add('hidden');
            }
        });

        if (!dropdownsInitialized) {
            initMobileDropdowns();
            dropdownsInitialized = true;
        }
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        enableBodyScroll();

        burgerBtns.forEach(btn => {
            btn.classList.remove('is-open', 'hidden');
        });

        closeAllDropdowns();

        isMobileMenuOpen = false;
        activeBurgerBtn = null;
    }

    function closeAllDropdowns() {
        const openDropdowns = mobileMenu.querySelectorAll('.header__item.dropdown.open');
        openDropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');

            const arrowSvg = dropdown.querySelector('.header__dropdown-arrow svg');
            if (arrowSvg) {
                arrowSvg.style.transform = 'rotate(180deg)';
            }
        });
    }

    function toggleDropdown(dropdownItem, arrowSvg) {
        if (dropdownItem.classList.contains('open')) {
            dropdownItem.classList.remove('open');
            arrowSvg.style.transform = 'rotate(180deg)';
        } else {
            closeAllDropdowns();
            dropdownItem.classList.add('open');
            arrowSvg.style.transform = 'rotate(0deg)';
        }
    }

    function initMobileDropdowns() {
        const dropdownItems = mobileMenu.querySelectorAll('.header__item.dropdown');

        dropdownItems.forEach(item => {
            const link = item.querySelector('.header__link');
            const arrow = link?.querySelector('svg');

            if (!arrow) return;

            const arrowClone = arrow.cloneNode(true);
            arrow.remove();

            const linkContainer = document.createElement('div');
            linkContainer.className = 'header__link-container';

            const newLink = link.cloneNode(true);
            newLink.innerHTML = link.querySelector('span').outerHTML;

            const arrowButton = document.createElement('button');
            arrowButton.className = 'header__dropdown-arrow';
            arrowButton.innerHTML = arrowClone.outerHTML;

            linkContainer.appendChild(newLink);
            linkContainer.appendChild(arrowButton);
            link.replaceWith(linkContainer);

            const arrowSvg = arrowButton.querySelector('svg');

            arrowButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown(item, arrowSvg);
            });

            newLink.addEventListener('click', (e) => {
                e.preventDefault();
            });
        });
    }

    burgerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (isMobileMenuOpen) {
                if (btn === activeBurgerBtn) {
                    closeMobileMenu();
                }
            } else {
                openMobileMenu(btn);
            }
        });
    });

    const closeBtn = mobileMenu.querySelector('.mobile-menu__close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMobileMenu();
        });
    }

    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMobileMenuOpen) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (isMobileMenuOpen) {
            const newScrollbarWidth = calculateScrollbarWidth();
            if (newScrollbarWidth !== scrollbarWidth) {
                scrollbarWidth = newScrollbarWidth;
                if (scrollbarWidth > 0) {
                    document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
                } else {
                    document.documentElement.style.paddingRight = '';
                }
            }
        }
    });
}

