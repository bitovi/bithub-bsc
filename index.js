import can from "can";
import $ from "jquery";

import Bit from "models/bit";

import "bits_carousel/";
import "bit_carousel/";

import "style/embed.less!";
//var bitData = new Bit.List(fixtures.data.slice(0, 10));

var RealBit = Bit.extend({
	findAll: function(params){
		return $.ajax({
			url: 'http://bithub.com/api/v3/embeds/147/entities?view=public&tenant_name=calm_dove_6826&image_only=true&' + $.param(params)
		});
	},
}, {});


import template from "./index.stache!";
//import "./carousel.less!";

var State = can.Map.extend({
	isAdmin(){
		return false;
	},
	assetRoot: "/bithub-bsc/",
	hubId: 1
});

$('body').on('cardExpanded', function(ev, height){
	var parent = window.parent;
	if(parent){
		parent.postMessage('cardExpanded:' + height, '*');
	}
});


var wrapCreate = function(data){
	data.tenant_name = 'radioactive_fern_9050';
	return {
		interaction: data
	};
};

var __scrollRecorded;

var InteractionEvent = can.Model.extend({
	create : 'POST http://bithub.com/api/v3/interactions',
	createScrollInteraction : function(hubId){
		return this.create(wrapCreate({
			primary_source_id: hubId,
			primary_source_type: 'Embed',
			event_type: 'carousel-scroll'
		}));
	},
	createLinkClickedInteraction : function(hubId, entityId){
		return this.create(wrapCreate({
			primary_source_id: hubId,
			primary_source_type: 'Embed',
			secondary_source_id: entityId,
			secondary_source_type: 'Entity',
			event_type: 'carousel-link'
		}));
	},
	createEntitySharedInteraction : function(hubId, entityId, target){
		return this.create(wrapCreate({
			primary_source_id: hubId,
			primary_source_type: 'Embed',
			secondary_source_id: entityId,
			secondary_source_type: 'Entity',
			event_type: 'carousel-share',
			event_subtype: target
		}));
	}
}, {});


$('body').on('interaction:carousel-scroll', function(ev, hubId){
	if(!__scrollRecorded){
		InteractionEvent.createScrollInteraction(hubId);
		__scrollRecorded = true;
	}
});
$('body').on('interaction:carousel-link', function(ev, hubId, entityId){
	InteractionEvent.createLinkClickedInteraction(hubId, entityId);
});
$('body').on('interaction:carousel-share', function(ev, hubId, entityId, target){
	InteractionEvent.createEntitySharedInteraction(hubId, entityId, target);
});


$('.bithub-embed').html(template({
	bitModel: RealBit,
	state: new State()
}));
