@import 'universal.js'
@import 'uiModal.js'

var onRun = function( context )
{	
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
			openModal = 0;
		} else {
			var colour = fill.color();
			all_colors.push([ colour.red(), colour.blue(), colour.green(), colour.alpha().toFixed(2)]);
		}
    }

    if(openModal == 1) {
		if(selection.count() < 2){
			doc.showMessage("Please select at least 2 shapes. Cheers!");
		} else if(currentArtboard) {
			uiModal(context);				
		} else {
			doc.showMessage("Please place shapes inside an artboard. Cheers!");
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