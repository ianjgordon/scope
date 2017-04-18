$(document).ready(function () {
	// Handling form data and validation
	window.scForm = {
		// defining user form element id's to register events to
		userFormKeys      : [
			'first-name', 'last-name', 'email-address', 'confirm-email-address'
		],
		// error messages
		validationMessages: [],
		// form values
		values            : {

			// promo code applied
			promoCode: false,

			// plan that they selected (monthly, annual)
			plan: false,

			// user details
			'first-name'           : false,
			'last-name'            : false,
			'email-address'        : false,
			'confirm-email-address': false,

			// promotianal checkbox
			promo: false,

			// payment details
			cardDetails: false
		},

		// set value to the form
		setFormValue           : function (key, value) {
			if (_.includes(_.keys(scForm.values), key)) {

				// TODO specify setting special form element values (addres, card details etc)
				switch (key) {
					case 'promoCode':
						// TODO validate promo code
						scForm.values.promoCode = value;
						break;
					case 'promo':
						scForm.values.promo = value;
						break;
					// In case of most form elements, just validate them and set if are valid
					default:
						if (scForm.validateFormValue(key, value)) {
							scForm.values[key] = value;
						} else {
							scForm.invalidForm(key, value);
						}
						break;
				}
				log(scForm.values);
			}
		},
		// validate a form value we are about to set
		validateFormValue      : function (key, value) {
			// email validation regular expression
			function validateEmail(email) {
				var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(email);
			}

			// check if we have the key stored
			if (_.includes(_.keys(scForm.values), key)) {
				switch (key) {
					case 'plan':
						return value === 'monthly' || value === 'annual';
					case 'email-address':
						// TODO check email validation
						return validateEmail(value);
					case 'confirm-email-address':
						// check if the email is already validated and saved, and if we wrote the same as a confirmation email
						return scForm.values['email-address'] && value === scForm.values['email-address'];
					default:
						return !_.isEmpty(value);
				}
			} else {
				return false;
			}
		},
		invalidForm            : function (key, value) {
			switch (key) {
				case 'add-specific-validation-key-here':
					scForm.validationMessages.push({message: 'Please provide your First Name', key: key});
					break;
				default:
					// we don't need to store message in javascript in most cases, enough to show hidden error messages in HTML
					scForm.validationMessages.push({message: 'Please provide this field', key: key});
			}
			// TODO set error messages and show them at appropriate places
			// (config element id's or classes to different validation errors)
		},
		showErrorMessages      : function (step) {
			if (!_.isEmpty(scForm.validationMessages)) {
				if (step === 2) {
					// show all error messages
					_.each(_.map(scForm.validationMessages, 'key'), function (invalidInput) {
						var inputId = '#' + invalidInput;
						// show specific error messages
						$(inputId + '-error').show();
						// add error class to input field
						$(inputId).addClass('error');
						// add error class to the field label
						$(inputId).prev('label.field-label').addClass('error');
					});
					// focus on first error
					$('#' + _.first(_.map(scForm.validationMessages, 'key'))).focus();
				}
			}
		},
		emptyValidationMessages: function () {
			scForm.validationMessages = [];
		},
		submitUserForm         : function () {
			// hide error messages and classes
			$('#userform .errormessage').hide();
			$('#userform input.error').removeClass('error');
			$('#userform .field-label').removeClass('error');
			// try saving user form data
			scForm.saveUserFormData();
			// if form is valid and the data is stored, go to next step
			if (_.isEmpty(scForm.validationMessages)) {
				scForm.layout.goToPage(3);
			} else {
				// in case of invalid form, show validation messages inline labels
				scForm.showErrorMessages(2);
			}
		},
		// validating and saving user form values
		saveUserFormData       : function () {
			scForm.emptyValidationMessages();
			_.each(scForm.userFormKeys, function (key) {
				scForm.setFormValue(key, $('#' + key).val());
			});
			scForm.showErrorMessages();
		},
		setPlan                : function (plan) {
			// set monthly plan to form variables
			scForm.setFormValue('plan', plan);
			// go to next step
			scForm.layout.goToPage(2);
			// focus user firstname
			$('#first-name').focus();
		},
		setPromoCode           : function (val, plan) {
			// set promo code to form variables
			scForm.setFormValue('promoCode', val);
			// set plan variable
			scForm.setPlan(plan);
		}
	};

	// handling form layout (pager etc)
	scForm.layout = {
		// currently active form page (first by default)
		activePage: 1,
		// go to given form page
		goToPage  : function (num) {
			// hiding other elements
			$('.form-page').each(function (i, elem) {
				$(elem).hide();
			});
			// setting active page number
			scForm.layout.activePage = num;
			// showing active form page
			$('.step' + scForm.layout.activePage).show();

			// setting active class on button
			// remove active
			$('ul.timeline>li.timeline-current').removeClass('timeline-current');
			// maintain tabindex
			$('ul.timeline>li.timeline-current a').attr('tabindex', -1);
			// add new active
			$('ul.timeline>li').eq(scForm.layout.activePage - 1).addClass('timeline-current');
			// add back to regular tabindex
			$('ul.timeline>li').eq(scForm.layout.activePage - 1).find('a').removeAttr('tabindex');
		},
		// initializing event handlers etc
		init      : function () {
			// making step number links unclickable - (only way forward would be with buttons)
			$('.timeline a').each(function (i, elem) {
				$(elem).on('click', function (e) {
					e.preventDefault();
				});
			});

			// show promo code input on click
			$('a#show-promo-code').on('click', function (e) {
				e.preventDefault();
				$('#enter-promo-code').show();
				$('#promo-code').on('keypress', function (e) {
					if (e.which === 13) {
						e.preventDefault();
						scForm.setPromoCode($('#promo-code').val(), 'monthly');
					}
				});
			});

			$('a#show-promo-code-alt').on('click', function (e) {
				e.preventDefault();
				$('#enter-promo-code-alt').show();
				$('#promo-code-alt').on('keypress', function (e) {
					if (e.which === 13) {
						e.preventDefault();
						// set value to form
						scForm.setPromoCode($('#promo-code-alt').val(), 'monthly');
					}
				});
			});

			// Add promo code button click
			$('button#add-promo-code').on('click', function (e) {
				e.preventDefault();
				// set form value to given attribute
				scForm.setFormValue('promoCode', $('#promo-code').val());
			});
			$('button#add-promo-code-alt').on('click', function (e) {
				e.preventDefault();
				// set form value to given attribute
				scForm.setFormValue('promoCode', $('#promo-code-alt').val());
			});

			// setting event handlers on the 'Continue' buttons
			$('button#continue-to-step-3').on('click', function (e) {
				e.preventDefault();
				scForm.submitUserForm();
			});

			// setting event for clicking on 'select plan' buttons (monthly, anually)
			$('a[data-plan]').each(function (i, elem) {
				// get plan value from html attribute
				var plan = $(elem).attr('data-plan');
				$(elem).on('click', function (e) {
					// prevent link follow
					e.preventDefault();
					// set plan variable to form
					scForm.setPlan(plan);
				});
			});

			// setting event on promo checkbox (save value to form variable)
			$('#remember').on('change', function () {
				scForm.setFormValue('promo', this.checked);
			});

			// Back button
			$('#back2').on('click', function (e) {
				e.preventDefault();
				// go to next step
				scForm.layout.goToPage(1);
			});

			$('#userform').on('submit', function (e) {
				e.preventDefault();
				scForm.submitUserForm();
			});

		}
	};

	scForm.layout.init();
});