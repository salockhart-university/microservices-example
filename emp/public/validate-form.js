(function () {
  'use strict';

  _.each(document.getElementsByTagName('form'), function (form) {
    let inputs = form.getElementsByTagName('input');

    let textInputs = _.filter(inputs, type('text', 'password'));
    let radioInputs = _.filter(inputs, type('radio'));
    let submit = _.filter(inputs, type('submit'))[0];

    form.addEventListener('input', function () {
      updateSubmit();
    });
    form.addEventListener('change', function () {
      updateSubmit();
    });

    updateSubmit();

    function updateSubmit() {
      if (submit) {
        submit.disabled = !atLeastOneRadioInputSelected() || !allRequiredTextInputsSet();
      }
    }

    function atLeastOneRadioInputSelected() {
      if (!radioInputs.length) {
        return true;
      }
      return _.reduce(_.map(radioInputs,
         inputs => inputs.checked), (prev, checked) => prev || checked, false);
    }

    function allRequiredTextInputsSet() {
      if (!textInputs.length) {
        return true;
      }
      return _.reduce(textInputs, (prev, text) => prev && (!text.required || text.value), true);
    }
  });

  function type() {
    const types = arguments;
    return e => _.includes(types, e.type);
  }
})();
