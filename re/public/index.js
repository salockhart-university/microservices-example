'use strict';

function serializeForm(form) {
	const arr = form.serializeArray();
	const json = {};
	arr.forEach(function (keyValue) {
		json[keyValue.name] = keyValue.value;
	});
	return json;
}

function formHasError(formData) {
	return Object.keys(formData).filter(function (key) {
		return formData[key] ? false : key;
	});
}

function clearWarnings(form) {
	const inputs = form.find(`input`);
	inputs.each(function () {
		$(this).toggleClass('input-error', false);
	});
}

function handleWarnings(form, errors) {
	errors.forEach(function (name) {
		form.find(`input[name=${name}]`).toggleClass('input-error', true);
	});
}

function apply(data, success, error) {
	$.ajax({
		type: 'POST',
		url: '/re/appraisal',
		data: JSON.stringify(data),
		contentType: 'application/json',
		success,
		error
	});
}

function registerApply() {
	$('#re-apply-form').submit(function (event) {
		event.preventDefault();

		clearWarnings($(this));

		const data = serializeForm($(this));
		const hasError = formHasError(data);
		if (hasError.length > 0) {
			return handleWarnings($(this), hasError)
		}

		apply(data, function (success) {
			console.log('Success!', success);
			$('#re-apply-success').html(`
				Success! Please visit your Mortgage Broker to see the updated status.
			`);
		}, function (error) {
			console.log('Error:', error);
			handleWarnings($('#re-apply-form'), ['mortID', 'name'])
			$('#re-apply-success').html(`
				Error! No mortgage found with that mortID and name.
			`);
		})
	});
}

$(document).ready(function () {
	registerApply();
});
