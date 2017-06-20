@import 'universal.js'
@import 'uiModal.js'


var kUUIDKey = 'google.analytics.uuid'
var uuid = NSUserDefaults.standardUserDefaults().objectForKey(kUUIDKey)
if (!uuid) {
  uuid = NSUUID.UUID().UUIDString()
  NSUserDefaults.standardUserDefaults().setObject_forKey(uuid, kUUIDKey)
}

function jsonToQueryString(json) {
  return '?' + Object.keys(json).map(function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
  }).join('&')
}

var index = function (context, trackingId, hitType, props) {
	var payload = {
    v: 1,
		tid: trackingId,
		ds: 'Sketch%20' + NSBundle.mainBundle().objectForInfoDictionaryKey("CFBundleShortVersionString"),
		cid: uuid,
    t: hitType,
    an: context.plugin.name(),
    aid: context.plugin.identifier(),
    av: context.plugin.version()
	}
	if (props) {
		Object.keys(props).forEach(function (key) {
      payload[key] = props[key]
    })
	}

	var url = NSURL.URLWithString(
    NSString.stringWithFormat("https://www.google-analytics.com/collect%@", jsonToQueryString(payload))
  )

	if (url) {
    NSURLSession.sharedSession().dataTaskWithURL(url).resume()
  }
}

var key = 'UA-101353604-1';
var sendEvent = function (context, category, action, label) {
	var payload = {};
	payload.ec = category;
	payload.ea = action;
	return index(context, key, 'event', payload);
}

var onRun = function( context )
{	
	sendEvent(context, 'onRun', 'Plugin triggered');

	// Get page context
	setContext(context);

	// Check selected items
	var selection = context.selection;
	
	var doc = context.document;
    var currentArtboard = doc.currentPage().currentArtboard();

    
    for(var i = 0; i < selection.count(); i++) {
		var layer = selection[i];
		var fill = firstVisibleFill(layer);
		if(!fill)
		{
			doc.showMessage("Please fill selected layers with color and try again. Cheers!");
			sendEvent(context, 'Error', 'Please fill selected layers with color and try again.');
			openModal = 0;
		} else {
			var colour = fill.color();
			all_colors.push([ colour.red(), colour.blue(), colour.green(), colour.alpha().toFixed(2)]);
		}
    }

    if(openModal == 1) {
		if(selection.count() < 2){
			doc.showMessage("Please select at least 2 shapes. Cheers!");
			sendEvent(context, 'Error', 'Please select at least 2 shapes.');
		} else if(currentArtboard) {
			uiModal(context);
		} else {
			doc.showMessage("Please place shapes inside an artboard. Cheers!");
			sendEvent(context, 'Error', 'Please place shapes inside an artboard.');
		}
	}
	
}

var barCode = function( context )
{
	
	var totalWidth = 0;

	// Get page context
	setContext(context);
	superDebug("BarCode function triggered");
	var selection = context.selection;

	// Set the variables
    var doc = context.document;
    var currentArtboard = doc.currentPage().currentArtboard();
    var width = currentArtboard.frame().width();
    var height = currentArtboard.frame().height();

    superDebug("currentArtboard", currentArtboard);
    superDebug("width", width);
    superDebug("height", height);
    superDebug("selection.count()", selection.count());

    //log(all_colors);
    groupLayer = MSLayerGroup.new();
    groupLayer.setName("Palette Stripes");
    created_looper_group = groupLayer.objectID();

    while(totalWidth < width ) {
    	var tempWidth = Math.floor(Math.random() * (max - min + 1)) + min;
    	superDebug("tempWidth", tempWidth);
    	var randCol = Math.floor(Math.random() * ((all_colors.length-1) - 0 + 1));
		superDebug("randCol", randCol);
		// Create rectangle
		var rect   = MSRectangleShape.alloc().init();
		rect.frame = MSRect.rectWithRect(NSMakeRect(totalWidth, 0, tempWidth, height));
		var shapeGroup = MSShapeGroup.shapeWithPath(rect);
		var fillRect = shapeGroup.style().addStylePartOfType(0);
		fillRect.color = MSColor.colorWithRed_green_blue_alpha(all_colors[randCol][0], all_colors[randCol][2], all_colors[randCol][1], all_colors[randCol][3]);
		groupLayer.addLayers([shapeGroup]);
		totalWidth = totalWidth + tempWidth;
    }
   	
   	currentArtboard.addLayers([groupLayer]);
    groupLayer.resizeToFitChildrenWithOption(0);

}


var firstVisibleFill = function(layer)
{
	for(var i = 0; i < layer.style().fills().count(); i++)
	{
		var fill = layer.style().fills().objectAtIndex(i);
		if(fill.isEnabled())
		{
			return fill;
		}
	}
	return false;
}

var superDebug = function( lbl, val )
{
  if(debugMode) {
      if(isNaN(val)) {
      log("BARCODE DEBUG // " + lbl);
      } else {
          log("BARCODE DEBUG // " + lbl + ": " + val);  
      } 
  }
}