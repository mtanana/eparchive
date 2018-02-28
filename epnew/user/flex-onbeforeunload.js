// JavaScript Documentvar FlexOnBeforeUnload = {
 var FlexOnBeforeUnload = {
   /**
    * Flag indicating the user should be prompted each
    * time they attempt to navigate away from or refresh
    * the Admin HTML page.
    */
   prompt: true,
 
   promptText: "Refreshing or leaving this page will cause you "
             + "to lose any unsaved data.\n"
             + "Are you sure you want to leave?",
 
   /**
    * Sets the value of "prompt"
    */
   setPrompt: function (value) {
      if (value) {
         FlexOnBeforeUnload.prompt = true;
      } else if (!value) {
         FlexOnBeforeUnload.prompt = false;
      }
   },
 
   /**
    * Sets the value of "promptText"
    */
   setPromptText: function (value) {
      FlexOnBeforeUnload.promptText = value;
   }
};