({
  createAccount : function(component, event) {
    var newAcc = component.get("v.newAccount");
    var action = component.get("c.saveAccount");
    action.setParams({ 
        "acc": newAcc
    });
    action.setCallback(this, function(a) {
           var state = a.getState();
            if (state === "SUCCESS") {
                var name = a.getReturnValue();
               alert("hello" + "");
            }
        });
    $A.enqueueAction(action)
},
    
    Close :  function(component, event, helper){
        var evt = $A.get("e.force:navigateToComponent");
        console.log('Event '+evt);
     //   var accountFromId = component.get("v.recordId");
        evt.setParams({
            componentDef  : "c:Task" ,
         //   componentAttributes : {}
        });
      
        evt.fire();
}
})