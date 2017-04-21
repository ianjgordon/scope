$(document).ready(function () {

	var sampleSuccessRequest = [
		{
			"id"                     : "sub_AW3XVkFLvjEDzG",
			"object"                 : "subscription",
			"application_fee_percent": null,
			"cancel_at_period_end"   : false,
			"canceled_at"            : null,
			"created"                : 1492779844,
			"current_period_end"     : 1495371844,
			"current_period_start"   : 1492779844,
			"customer"               : "cus_AW3XreyblCfUhx",
			"discount"               : null,
			"ended_at"               : null,
			"items"                  : {
				"object"     : "list",
				"data"       : [
					{
						"id"      : "si_1AB1QeImICA5mZ1cB2xQaA6G",
						"object"  : "subscription_item",
						"created" : 1492779844,
						"plan"    : {
							"id"                  : "basic-monthly",
							"object"              : "plan",
							"amount"              : 750,
							"created"             : 1492776750,
							"currency"            : "gbp",
							"interval"            : "month",
							"interval_count"      : 1,
							"livemode"            : false,
							"metadata"            : {},
							"name"                : "Monthly Plan",
							"statement_descriptor": null,
							"trial_period_days"   : null
						},
						"quantity": 1
					}
				],
				"has_more"   : false,
				"total_count": 1,
				"url"        : "/v1/subscription_items?subscription=sub_AW3XVkFLvjEDzG"
			},
			"livemode"               : false,
			"metadata"               : {},
			"plan"                   : {
				"id"                  : "basic-monthly",
				"object"              : "plan",
				"amount"              : 750,
				"created"             : 1492776750,
				"currency"            : "gbp",
				"interval"            : "month",
				"interval_count"      : 1,
				"livemode"            : false,
				"metadata"            : {},
				"name"                : "Monthly Plan",
				"statement_descriptor": null,
				"trial_period_days"   : null
			},
			"quantity"               : 1,
			"start"                  : 1492779844,
			"status"                 : "active",
			"tax_percent"            : null,
			"trial_end"              : null,
			"trial_start"            : null
		}
	];


	// config object for calling APIs est
	window.scConfig = {

		//============ PCA DETAILS ================
		// API key for PCA Predict address lookup
		pcaAddressAPIKey    : 'AY29-CM18-GM19-XH93',
		// PCA Predict Search url (finding addresses based on free text)
		pcaSearchURL        : '//services.postcodeanywhere.co.uk/CapturePlus/Interactive/Find/v2.10/json3.ws',
		// PCA Predict url for getting a specifi address's details
		pcaAddressDetailsURL: '//services.postcodeanywhere.co.uk/CapturePlus/Interactive/Retrieve/v2.10/json3.ws',


		//========== APP BUSINESS LOGIC DATA ==========
		// monthly plan amount
		monthlyPlanAmount: 7.5,
		// annual plan amount
		annualPlanAmount : 60
	};

	// Handling form data and validation
	window.scForm = {
		// defining user form element id's to register events to
		userFormFields              : ['first-name', 'last-name', 'email-address', 'confirm-email-address'],
		cardFormFields              : ['card-name', 'card-number', 'card-expiry-month', 'card-expiry-year', 'card-security-code', 'card-issue-number'],
		addressFormFields           : ['street-address', 'line2', 'line3', 'city', 'county', 'postcode', 'mobile'],
		optionalFields              : ['line2', 'line3', 'county', 'card-issue-number'],
		addressFormKeyMapping       : {
			'street-address': 'Line1',
			'line2'         : 'Line2',
			'line3'         : 'Line3',
			'city'          : 'City',
			'postcode'      : 'PostalCode'
		},
		billingAddressFormKeyMapping: {
			'billing-street-address': 'Line1',
			'billing-line2'         : 'Line2',
			'billing-line3'         : 'Line3',
			'billing-city'          : 'City',
			'billing-postcode'      : 'PostalCode'
		},
		billingFormRequiredFields   : ['billing-street-address', 'billing-city', 'billing-postcode'],
		// error messages
		validationMessages          : [],
		// form values
		values                      : {

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
			'opt-in': false,

			// gift aid accept checkbox
			'gift-aid': false,

			// checkbox value representing if the billing address is the same as the delivery address previously provided
			'billing-address-same': true,

			// delivery address fields
			'street-address'        : false,
			'line2'                 : false,
			'line3'                 : false,
			'city'                  : false,
			'county'                : false,
			'postcode'              : false,
			// billing address fields
			'billing-street-address': false,
			'billing-line2'         : false,
			'billing-line3'         : false,
			'billing-city'          : false,
			'billing-county'        : false,
			'billing-postcode'      : false,
			// mobile phone
			'mobile'                : false,

			// card details
			'card-name'         : false,
			'card-number'       : false,
			'card-expiry-month' : false,
			'card-expiry-year'  : false,
			'card-security-code': false,
			'card-issue-number' : false
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
					case 'opt-in':
						scForm.values['opt-in'] = value;
						break;
					case 'gift-aid':
						scForm.values['gift-aid'] = value;
						break;
					case 'billing-address-same':
						scForm.values['billing-address-same'] = value;
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
				// log(scForm.values);
				// update fields to show form data
				scForm.updateSummaryFields();
			}
		},
		// update information that is showing on the order summary screen (and place the information into the layout)
		updateSummaryFields    : function () {
			// assign extra information
			_.assign(scForm.values, {
				// Amount to show on summary page based on selected plan
				amount                   : scForm.values.plan ? (scForm.values.plan === 'monthly' ? scConfig.monthlyPlanAmount : scConfig.annualPlanAmount) : '',
				// TODO figure this out
				'start-date'             : 'TODO',
				'card-number-last-digits': scForm.values['card-number'] ? scForm.values['card-number'].slice(-4) : ''
			});
			// Fill placeholders for form values
			_.each(scForm.values, function (value, key) {
				var element = $('#' + key + '-holder');
				if (element.length) {
					element.html(value);
				}
			});
		},
		// validate a form value we are about to set
		validateFormValue      : function (key, value) {
			// email validation regular expression
			function validateEmail(val) {
				var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(val);
			}

			// UK phone validation regular expression
			function validateMobile(val) {
				var re = /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/;
				return re.test(val);
			}

			// UK phone validation regular expression
			function validateCVV(val) {
				var re = /^[0-9]{3,4}$/;
				return re.test(val);
			}

			// check if we have the key stored
			if (_.includes(_.keys(scForm.values), key)) {
				// These are the fields that don't need validation
				if (_.includes(scForm.optionalFields, key)) {
					return true;
				}
				// set validation based on the key
				switch (key) {
					case 'plan':// selecting a plan (monthly, annual)
						return value === 'monthly' || value === 'annual';
					case 'email-address': //(needs to be valid email)
						return validateEmail(value);
					case 'card-security-code': //(needs to be valid cvv)
						return validateCVV(value);
					case 'mobile': // if given, validate as mobile
						if (!_.isEmpty(value)) {
							logi('validating', validateMobile(value));
							return validateMobile(value);
						}
						return true;
					case 'confirm-email-address':
						// check if the email is already validated and saved, and if we wrote the same as a confirmation email
						return scForm.values['email-address'] && value === scForm.values['email-address'];
					// if none of the above, treat the field as it should be provided (not empty)
					default:
						return !_.isEmpty(value);
				}
			} else {
				return '';
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
		},
		showErrorMessages      : function (step) {
			if (!_.isEmpty(scForm.validationMessages)) {
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
		submitAddressForm      : function () {
			// hide error messages and classes
			$('#addressform .errormessage').hide();
			$('#addressform input.error').removeClass('error');
			$('#addressform .field-label').removeClass('error');
			// try saving user form data
			scForm.saveAddressFormData();
			// if form is valid and the data is stored, go to next step
			if (_.isEmpty(scForm.validationMessages)) {
				scForm.layout.goToPage(4);
			} else {
				// in case of invalid form, show validation messages inline labels
				scForm.showErrorMessages(3);
			}
		},
		submitCardForm         : function () {
			// hide error messages and classes
			$('#cardform .errormessage').hide();
			$('#cardform input.error').removeClass('error');
			$('#cardform .field-label').removeClass('error');
			// try saving user form data
			scForm.saveCardFormData();
			// if form is valid and the data is stored, go to next step
			if (_.isEmpty(scForm.validationMessages)) {
				scForm.layout.goToPage(5);
			} else {
				// in case of invalid form, show validation messages inline labels
				scForm.showErrorMessages(4);
			}
		},
		// validating and saving user form values
		saveUserFormData       : function () {
			scForm.emptyValidationMessages();
			_.each(scForm.userFormFields, function (key) {
				scForm.setFormValue(key, $('#' + key).val());
			});
			scForm.showErrorMessages();
		},
		// validating and saving user form values
		saveCardFormData       : function () {
			scForm.emptyValidationMessages();
			_.each(scForm.cardFormFields, function (key) {
				scForm.setFormValue(key, $('#' + key).val());
			});
			scForm.showErrorMessages();
		},
		// validating and saving address form values
		saveAddressFormData    : function () {
			scForm.emptyValidationMessages();
			_.each(scForm.addressFormFields, function (key) {
				scForm.setFormValue(key, $('#' + key).val());
			});
			scForm.showErrorMessages();
		},
		setPlan                : function (plan) {
			// set monthly plan to form variables
			scForm.setFormValue('plan', plan);
			// go to next step
			scForm.layout.goToPage(2);
		},
		setPromoCode           : function (val, plan) {
			// set promo code to form variables
			scForm.setFormValue('promoCode', val);
			// set plan variable
			scForm.setPlan(plan);
		},
		autoFillAddressForm    : function (data, type) {
			$(type === 'delivery' ? '#address-form-details' : '#billing-address-form-details').show();
			_.each(type === 'delivery' ? scForm.addressFormKeyMapping : scForm.billingAddressFormKeyMapping, function (dataKey, elementId) {
				$('#' + elementId).val(data[dataKey]);
			});
		},
		APISearchAddresses     : function (type) {
			// hide special postcode search error message
			$(type === 'delivery' ? '#postcode-search-error' : '#billing-postcode-search-error').hide();
			// send request
			$.ajax({
				url     : scConfig.pcaSearchURL,
				dataType: "jsonp",
				data    : {
					key       : scConfig.pcaAddressAPIKey,
					searchFor : "Everything",
					country   : 'UK',
					searchTerm: type === 'delivery' ? $('#postcode-search').val() : $('#billing-postcode-search').val()
				},
				success : function (data) {
					if (_.isEmpty(data.Items) || data.Items[0].Next !== 'Retrieve') {
						// search error message
						$(type === 'delivery' ? '#postcode-search-error' : '#billing-postcode-search-error').show();
					} else {
						// build select box with search results
						scForm.layout.buildSearchSelect(data.Items, type);
					}
				}
			});
		},
		APIGetAddressDetails   : function (type) {
			var address = $(type === 'delivery' ? '#address-results' : '#billing-address-results').val();
			// hide special postcode search error message
			$(type === 'delivery' ? '#address-detail-error' : '#billing-address-detail-error').hide();
			$.ajax({
				url     : scConfig.pcaAddressDetailsURL,
				dataType: "jsonp",
				data    : {
					key: scConfig.pcaAddressAPIKey,
					id : address
				},
				success : function (data) {
					if (data.Items.length) {
						if (!data.Items || data.Items[0].Error) {
							// search error message
							$(type === 'delivery' ? '#postcode-search-error' : '#billing-postcode-search-error').show();
						} else {
							// Fill form with data
							scForm.autoFillAddressForm(data.Items[0], type);
						}
					}
				}
			});
		},
		APIPostForm            : function () {

			var testFormData = {
				"promoCode"              : false,
				"plan"                   : "monthly",
				"first-name"             : "Ferenc",
				"last-name"              : "Takacs",
				"email-address"          : "sdfklj@gmail.com",
				"confirm-email-address"  : "sdfklj@gmail.com",
				"opt-in"                 : false,
				"gift-aid"               : false,
				"billing-address-same"   : true,
				"street-address"         : "1 Castleview Close",
				"line2"                  : "",
				"line3"                  : "",
				"city"                   : "London",
				"county"                 : "",
				"postcode"               : "N4 2DJ",
				"billing-street-address" : false,
				"billing-line2"          : false,
				"billing-line3"          : false,
				"billing-city"           : false,
				"billing-county"         : false,
				"billing-postcode"       : false,
				"mobile"                 : "",
				"card-name"              : "Test User",
				"card-number"            : "4242424242424242",
				// "card-number"            : "sldkfjsdfkj",
				"card-expiry-month"      : "1",
				"card-expiry-year"       : "18",
				"card-security-code"     : "234",
				"card-issue-number"      : "",
				"amount"                 : 7.5,
				"start-date"             : "TODO",
				"card-number-last-digits": "0498"
			};

			scForm.layout.clearPostErrors();

			// $.ajax({
			// 	type       : 'POST',
			// 	url        : 'http://arubacloud.duckdns.org:3000/api/card',
			// 	data       : JSON.stringify(testFormData),
			// 	// data       : JSON.stringify(scForm.values),
			// 	success    : function (data) {
			// 		if (data.error) {
			// 			scForm.handleStripeError(data.error);
			// 		}
			// 		log(data);
			// 	},
			// 	contentType: "application/json",
			// 	dataType   : 'json'
			// });
		},
		handleStripeError      : function (err) {
			//TODO remove
			// log(err.message);
			switch (err.type) {
				// TODO highlight card layout on summary page with error
				case 'StripeCardError':
					// A declined card error

					break;
				case 'StripeInvalidRequestError':
					// Invalid parameters were supplied to Stripe's API
					break;
				case 'StripeAPIError':
					// An error occurred internally with Stripe's API
					break;
				case 'StripeConnectionError':
					// Some kind of error occurred during the HTTPS communication
					break;
				case 'StripeAuthenticationError':
					// You probably used an incorrect API key
					break;
				case 'StripeRateLimitError':
					// Too many requests hit the API too quickly
					break;
			}
		}
	};

	// handling form layout (pager etc)
	scForm.layout = {
		// currently active form page (first by default)
		activePage              : 1,
		// go to given form page
		goToPage                : function (num) {
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

			// calculate active element index (page five stays on 4th tab)
			var newIndex = scForm.layout.activePage === 5 ? 3 : scForm.layout.activePage - 1;
			// add new active
			$('ul.timeline>li').eq(newIndex).addClass('timeline-current');
			// add back to regular tabindex
			$('ul.timeline>li').eq(newIndex).find('a').removeAttr('tabindex');

			// scroll to the top of the page
			window.scrollTo(0, 0);
			// focus first input
			$('form :input:visible:enabled:first').focus();
		},
		// build Address search Results
		buildSearchSelect       : function (data, type) {
			var id             = type === 'delivery' ? 'address-results' : 'billing-address-results';
			var searchButtonId = type === 'delivery' ? 'select-address-result' : 'billing-select-address-result';
			// Build select box with result addresses
			var all            = $('<div></div>');
			var select         = $('<select id="' + id + '" name="' + id + '"></select>');
			_.each(data, function (result) {
				select.append($('<option value="' + result.Id + '">' + result.Text + '</option>'));
			});
			var butt = $('<button name="' + searchButtonId + '" id="' + searchButtonId + '" class="pure-button continue">Select address</button>');
			all.append(select);
			all.append(butt);
			// add generated layout to the DOM
			$('#' + id + '-wrapper').html(all);
			// set action for newly created 'Select address' button
			$('#' + searchButtonId).on('click', function (e, item) {
				e.preventDefault();
				scForm.APIGetAddressDetails(type);
			});
		},
		clearPostErrors         : function () {

		},
		// show / hide extra billing address form bits PLUS add or remove required fields
		handleBillingAddressForm: function () {
			var handleRequiredAttributes = function (state) {
				_.each(scForm.billingFormRequiredFields, function (key) {
					if (state) {
						$('#' + key).attr('required', true);
					} else {
						$('#' + key).removeAttr('required');
					}
				});
			};
			if (scForm.values['billing-address-same']) {
				$('#billing-address-form-wrapper').hide();
				handleRequiredAttributes(false);
			} else {
				$('#billing-address-form-wrapper').show();
				handleRequiredAttributes(true);
			}
		},
		// initializing event handlers etc
		init                    : function () {
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
				$('#add-promo-code').on('keypress', function (e) {
					if (e.which === 13) {
						e.preventDefault();
						scForm.setPromoCode($('#promo-code').val(), 'monthly');
					}
				});
			});

			$('a#show-promo-code-alt').on('click', function (e) {
				e.preventDefault();
				$('#enter-promo-code-alt').show();
				$('#add-promo-code-alt').on('keypress', function (e) {
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
				scForm.setPromoCode($('#promo-code').val(), 'monthly');
			});
			$('button#add-promo-code-alt').on('click', function (e) {
				e.preventDefault();
				// set form value to given attribute
				scForm.setPromoCode($('#promo-code-alt').val(), 'monthly');
			});

			// setting event handlers on the 'Continue' buttons
			$('button#submit-user-form').on('click', function (e) {
				e.preventDefault();
				scForm.submitUserForm();
			});

			// setting event handlers on the 'Continue' buttons
			$('button#submit-address-form').on('click', function (e) {
				e.preventDefault();
				scForm.submitAddressForm();
			});

			// setting event handlers on the 'Continue' buttons
			$('button#submit-card-form').on('click', function (e) {
				e.preventDefault();
				scForm.submitCardForm();
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

			// setting event on opt-in checkbox (save value to form variable)
			$('#opt-in').on('change', function () {
				scForm.setFormValue('opt-in', this.checked);
			});
			// setting event on gift-aid checkbox (save value to form variable)
			$('#gift-aid').on('change', function () {
				scForm.setFormValue('gift-aid', this.checked);
			});

			// setting action on 'billing address different' checkbox (show extra form to provide billing address)
			$('#billing-address-same').on('change', function () {
				scForm.setFormValue('billing-address-same', this.checked);
				scForm.layout.handleBillingAddressForm();
			});

			$('.gotopage').on('click', function (e) {
				e.preventDefault();
				scForm.layout.goToPage($(this).attr('data-page'));
			});

			// Searching for addresses based on given text (hopefully postcode)
			$('#find-address').on('click', function () {
				scForm.APISearchAddresses('delivery');
			});
			// Searching for addresses based on given text (hopefully postcode)
			$('#show-address-link').on('click', function (e) {
				e.preventDefault();
				$('#address-form-details').show();
			});


			// Submitting forms
			$('#userform').on('submit', function (e) {
				alert('form submitted');
				e.preventDefault();
				scForm.submitUserForm();
			});
			$('#addressform').on('submit', function (e) {
				alert('form submitted');
				e.preventDefault();
				scForm.submitAddressForm();
			});
			$('#cardform').on('submit', function (e) {
				alert('form submitted');
				e.preventDefault();
				scForm.submitCardForm();
			});

			$('#addresssearchform').on('submit', function (e) {
				e.preventDefault();
				scForm.APISearchAddresses('delivery');
			});

			$('#billing-postcode-search').on('keypress', function (e) {
				if (e.which === 13) {
					e.preventDefault();
					scForm.APISearchAddresses('billing');
				}
			});

			// Searching for addresses based on given text (hopefully postcode)
			$('#billing-find-address').on('click', function (e) {
				e.preventDefault();
				scForm.APISearchAddresses('billing');
			});

			$('#place-order,#how').on('click', function (e) {
				e.preventDefault();
				scForm.APIPostForm();
			});
		}
	};
	scForm.layout.init();
});