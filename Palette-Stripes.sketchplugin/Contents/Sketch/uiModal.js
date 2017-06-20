var uiModal = function(context)
{
    var ui_comp_height = 24;
    var panel_height = 155;
    var panel_width = 200;
	setContext(context);
	
    // Set MSPanel
    var frame = NSMakeRect(0, 0, panel_width, panel_height);

    var Panel = NSPanel.alloc().init();
    Panel.setTitlebarAppearsTransparent(true);
    Panel.standardWindowButton(NSWindowCloseButton).setHidden(false);
    Panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true);
    Panel.standardWindowButton(NSWindowZoomButton).setHidden(true);
    Panel.setFrame_display(frame, false);
    //Panel.setBackgroundColor(contentBgColor);
    var contentView = Panel.contentView();
    contentView.setBackgroundColor(titleBgColor);
    
    var titlebarView = contentView.superview().titlebarViewController().view(),
    titlebarContainerView = titlebarView.superview();
    titlebarView.setBackgroundColor(titleBgColor);
    titlebarContainerView.superview().setBackgroundColor(titleBgColor);

    var closeButton = Panel.standardWindowButton(NSWindowCloseButton);
    closeButton.setCOSJSTargetFunction(function(sender) {
        Panel.orderOut(nil);
        NSApp.stopModal();
    });
    closeButton.setAction("callAction:");

    // UI elements
    
    // Buttons
    var button = NSButton.alloc().initWithFrame(NSMakeRect((panel_width/2)-(75/2), panel_height-32-105, 75, ui_comp_height));
    button.setTitle("Redraw")
    button.setButtonType(NSMomentaryChangeButton)
    [button setBezelStyle:NSRoundedBezelStyle];
    button.setCOSJSTargetFunction(function(sender) {
        getValueFromModal();
        var layers = current.layers()
        for (var ia=0; ia < [layers count]; ia++) {
            var layer = [layers objectAtIndex:ia]
            if(layer.objectID() == created_looper_group){
              layer.removeFromParent()
            }
        }
        barCode(context);
    });
    button.setAction("callAction:");
    [contentView addSubview: button]

    var lbl1 = createLabel("Min width", 12, false, conRGB(118), conRGB(118), conRGB(118), 1.0, NSMakeRect(20, panel_height-32-35, 100, ui_comp_height));
    var lbl2 = createLabel("Max width", 12, false, conRGB(118), conRGB(118), conRGB(118), 1.0, NSMakeRect(20, panel_height-32-65, 100, ui_comp_height));

    var duplicateBoxControls = [lbl1, lbl2];

    var duplicateBox = createBoxForControls(NSMakeRect(0, 380, 230, 160), duplicateBoxControls, 'Duplicate');
    [contentView addSubview: lbl1]
    [contentView addSubview: lbl2]

    // Textbox
    txt_min = [[NSTextField alloc] initWithFrame: NSMakeRect(panel_width-50-20,panel_height-32-35,50,ui_comp_height)]
    [txt_min setStringValue: "10"]
    [txt_min setBezelStyle:NSRoundedBezelStyle];
    [contentView addSubview: txt_min]

    // Textbox
    txt_max = [[NSTextField alloc] initWithFrame: NSMakeRect(panel_width-50-20,panel_height-32-65,50,ui_comp_height)]
    [txt_max setStringValue: "40"]
    [txt_max setBezelStyle:NSRoundedBezelStyle];
    [contentView addSubview: txt_max]

    if(loopedOnce == 0) {
        loopedOnce = 1;
        min = 10;
        max = 40;
        barCode(context);
    }
        
    // Trigger MSPanel
    NSApp.runModalForWindow(Panel);

}

var getValueFromModal = function() {
    min = [txt_min intValue]
    max = [txt_max intValue]

    if(min > max) {
        var tem = min;
        min = max;
        max = tem;
    }
    superDebug("min", min);
    superDebug("max", max);
}

