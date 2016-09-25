'use strict';

const APPID = require('./appid.json').id;

exports.handler = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;

	if (event.session.application.applicationId !== APPID) {
		callback("Request wasn't meant for this application");
	}

    switch(event.request.type) {
    	case 'LaunchRequest':
    		launchRequest(event, callback);
    		break;
    	case 'IntentRequest':
    		intentRequest(event, callback);
    		break;
    	case 'SessionEndedRequest':
    		sessionEndedRequest(callback);
    		break;
    	default:
    		callback('Request type not supported')
    }
};

function Response() {
	this.version = "1.0";
	this.sessionAttributes = {};
	this.response = {};
	this.response.outputSpeech = {};
	this.response.card = {};
	this.response.reprompt = {};
	this.response.reprompt.outputSpeech = {};
	this.shouldEndSession;
}

function launchRequest(event, callback) {
	var res = new Response();

	res.response.outputSpeech = {
		"type": "PlainText",
		"text": "Welcome. You can ask me questions such as, what is ten percent of one hundred? Decimal places are not currently supported."
	};

	res.response.card = {
		"type": "Simple",
      	"title": "PercentageCalculator",
      	"content": "Welcome. You can ask me questions such as, what is ten percent of one hundred? Decimal places are not currently supported."
	}

	res.response.reprompt.outputSpeech = {
		"type": "PlainText",
		"text": "Welcome. You can ask me questions such as, what is ten percent of one hundred? Decimal places are not currently supported."
	};

	res.response.shouldEndSession = true;
	
	callback(null, res);
}

function intentRequest(event, callback) {
	switch(event.request.intent.name) {
		case 'CalculatePercentageIntent':
			calculatePercentageIntent(event, callback);
		break;
		case 'AMAZON.HelpIntent':
			helpIntent(event, callback);
		break;
		default:
		callback('Intent type not supported')
	}
}

function calculatePercentageIntent(event, callback) {
	var res = new Response();

	var percentValue = event.request.intent.slots.Percentage.value;
	var value = event.request.intent.slots.Value.value;
	var result = (percentValue / 100) * value;

	if (isNaN(result)) {
		handleFailedCalculation(callback);
	}

	var text = percentValue + " percent of " + value + " is " + result;

	res.response.outputSpeech = {
		"type": "PlainText",
		"text": text
	};

	res.response.card = {
		"type": "Simple",
      	"title": "PercentageCalculator Result",
      	"content": text
	}

	res.response.reprompt.outputSpeech = {
		"type": "PlainText",
		"text": text
	};

	res.response.shouldEndSession = true;
	
	callback(null, res);
}

function handleFailedCalculation(callback) {
	var res = new Response();

	res.response.outputSpeech = {
		"type": "PlainText",
		"text": "I'm sorry, I couldn't calculate your request."
	};

	res.response.card = {
		"type": "Simple",
      	"title": "PercentageCalculator Error",
      	"content": "I'm sorry, I couldn't calculate your request."
	}

	res.response.reprompt.outputSpeech = {
		"type": "PlainText",
		"text": "I'm sorry, I couldn't calculate your request"
	};

	res.response.shouldEndSession = true;
	
	callback(null, res);
}

function helpIntent(event, callback) {
	var res = new Response();

	res.response.outputSpeech = {
		"type": "PlainText",
		"text": "You can ask me questions such as, what is ten percent of one hundred? Decimal places are not currently supported."
	};

	res.response.card = {
		"type": "Simple",
      	"title": "PercentageCalculator",
      	"content": "You can ask me questions such as, what is ten percent of one hundred? Decimal places are not currently supported."
	}

	res.response.reprompt.outputSpeech = {
		"type": "PlainText",
		"text": "You can ask me questions such as, what is ten percent of one hundred? Decimal places are not currently supported."
	};

	res.response.shouldEndSession = true;
	
	callback(null, res);
}

function sessionEndedRequest(callback) {
	callback(null);
}