// library select. function initialize Select

export function initializeSelect() {
  const selectElements = document.querySelectorAll('.add-contact__form-select');

  selectElements.forEach(element => {
    // eslint-disable-next-line no-unused-vars, no-undef
    const choices = new Choices(element, {
      searchEnabled: false,
      itemSelectText: '',
      position: 'bottom',
      classNames: {
        containerOuter: 'default-select',
        containerInner: 'default-select__inner',
        input: 'default-select__input',
        inputCloned: 'default-select__input--cloned',
        list: 'default-select__list',
        listItems: 'default-select__list--multiple',
        listSingle: 'default-select__list--single',
        listDropdown: 'default-select__list--dropdown',
        item: 'default-select__item',
        itemSelectable: 'default-select__item--selectable',
        itemDisabled: 'default-select__item--disabled',
        itemChoice: 'default-select__item--choice',
        placeholder: 'default-select__placeholder',
        group: 'default-select__group',
        groupHeading: 'default-select__heading',
        button: 'default-select__button',
        activeState: 'is-active',
        focusState: 'is-focused',
        openState: 'is-open',
        disabledState: 'is-disabled',
        highlightedState: 'is-highlighted',
        selectedState: 'is-selected',
        flippedState: 'is-flipped',
        loadingState: 'is-loading',
        noResults: 'has-no-results',
        noChoices: 'has-no-default-select'
      },
    });
  })
}
