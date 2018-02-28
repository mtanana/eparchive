var ImageButtons = {


	getNewRadioButton : function(name, checked) {
		var rb = document.createElement("div");

		if (checked) {
			rb.className = "checkedrb";
			rb.selected=true;
			
		} else {
			rb.className = "uncheckedrb";
			rb.selected=false;
		}
		rb.setAttribute('name',name);
		rb.addEventListener("click", this.radioClick,false);
		
		return rb;
	},

	radioClick : function(event) {
		var thisGuy = this;
		
		thisGuy.className = "checkedrb";
		thisGuy.selected=true;
		var name = thisGuy.getAttribute('name');
		
		var items = document.getElementsByName(name);
		for(var i=0;i<items.length;i++){
			var item = items[i];
			if(item!=thisGuy){
				item.selected=false;
			}
			if(item.selected)item.className = "checkedrb";
			else item.className="uncheckedrb";
		}
		
	}
}