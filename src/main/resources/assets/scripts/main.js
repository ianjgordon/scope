$(document).ready(function () {
	// Handling form data and validation
	window.scForm = {
		values: {

			// plan that they selected (monthly, annual)
			plan: false,

			// user details
			firstName   : false,
			lastName    : false,
			email       : false,
			emailConfirm: false,

			// promotianal checkbox
			promo: false,

			// payment details
			cardDetails: false
		},

		// set value to the form
		setFormValue: function (key, value) {
			if (_.includes(_.keys(scForm.values), key)) {
				switch (key) {
					case 'plan':
						if (scForm.validateFormValue(key, value)) {
							scForm.values[key] = value;
						} else {
							scForm.invalidForm(key, value);
						}
						break;
					case 'promo':
						scForm.values.promo = value;
						break;
				}
				log(scForm.values);
			}
		},

		// validate a form value we are about to set
		validateFormValue: function (key, value) {
			if (_.includes(_.keys(scForm.values), key)) {
				switch (key) {
					case 'plan':
						return value === 'monthly' || value === 'annual';
					default:
				}
			} else {
				return false;
			}
		},
		invalidForm      : function () {
			// TODO set error messages and show them at appropriate places
			// (config element id's or classes to different validation errors)
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
			// add new active
			$('ul.timeline>li').eq(scForm.layout.activePage - 1).addClass('timeline-current');

			// todo change url hash
			// window.location.hash = 'step' + scForm.layout.activePage;
		},
		// initializing event handlers etc
		init      : function () {
			// setting event for clicking on step numbers
			$('.timeline a').each(function (i, elem) {
				$(elem).on('click', function (e) {
					e.preventDefault();
					scForm.layout.goToPage(i + 1);
				});
			});
			// setting event for clicking on 'select plan' buttons (monthly, anually)
			$('a[data-plan]').each(function (i, elem) {
				// get plan value from html attribute
				var plan = $(elem).attr('data-plan');
				$(elem).on('click', function (e) {
					// prevent link follow
					e.preventDefault();
					// set form value to given attribute
					scForm.setFormValue('plan', plan);
					// go to next step
					scForm.layout.goToPage(2);
				});
			});

			// setting event on promo checkbox (save value to form variable)
			$('#remember').on('change', function () {
				scForm.setFormValue('promo', this.checked);
			});

		}
	};

	scForm.layout.init();
});