var debugMode = false;
var all_colors = [];
var created_looper_group;
var max;
var min;
var openModal = 1;

// Context
var doc,
pages,
page,
artboard,
current;

var contentColor,
titleBgColor,
contentBgColor;

var contentColor = NSColor.colorWithRed_green_blue_alpha(0.1, 0.1, 0.1, 1);
var titleBgColor = [NSColor colorWithCalibratedRed:conRGB(15) green:conRGB(100) blue:conRGB(253) alpha:1]
var boxBgColor = NSColor.colorWithRed_green_blue_alpha(1, 1, 1, 1);
var contentBgColor = NSColor.colorWithRed_green_blue_alpha(0.05, 0.05, 0.05, 1);
var boldFont = [NSFont boldSystemFontOfSize:13.0];

// Generate count
var loopedOnce = 0;

// Modal UI component
var ui_count_input;

// context func
function setContext(context) {
	doc = context.document;
	pages = doc.pages();
	page = doc.currentPage();
	artboard = page.currentArtboard();
	current = artboard || page;	
}

// Modal UI funcs
function conRGB(col) {
	col = col/255;
	return col;
}
function createLabel(text, fontSize, bold, cR, cG, cB, cA, frame) {
    var label = NSTextField.alloc().initWithFrame(frame)
    label.setStringValue(text)
    label.setFont((bold) ? NSFont.boldSystemFontOfSize(fontSize) : NSFont.systemFontOfSize(fontSize))
    label.setBezeled(false)
    label.setDrawsBackground(false)
    label.setEditable(false)
    label.setSelectable(false)
    [label setTextColor: [NSColor colorWithCalibratedRed:cR green:cG blue:cB alpha:cA]]
    return label
}
function createTextfield(text, checkAction, frame) {
    var textField = NSTextField.alloc().initWithFrame(frame)
    textField.setStringValue(text)
    textField.setBezelStyle(NSRoundedBezelStyle)
    if(checkAction) {
    	textField.setAction("callAction:");
	}
    return textField
}
function createBoxForControls(frame, controls, title) {
    var box = [[NSBox alloc] initWithFrame: frame];
    [box setTitle: ""];
    for (var i = 0; i < controls.length; i++) {
    [box addSubview:controls[i]];
    }
    [box setContentViewMargins:NSMakeSize(10, 10)];
    box.setBoxType(NSBoxCustom);
    box.setBorderWidth(0);
    box.setCornerRadius(2.0);
    [box setFillColor: boxBgColor];
    [box setTitleFont: boldFont];
    [box setTitlePosition: NSBelowTop];
    [[box titleCell] setTextColor: contentColor];
    return box;
}
function openURL(url){
  var nsurl = NSURL.URLWithString(url + '?ref=smp');
  NSWorkspace.sharedWorkspace().openURL(nsurl)
}
