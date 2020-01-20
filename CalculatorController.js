({
	OnAdd : function(component, event, helper) {
        var Number1=component.get('v.No1');
        var Number2=component.get('v.No2');
        component.set('v.No3', parseInt(Number1) + parseInt(Number2));
		
	},

	OnSub : function(component, event, helper) {
          var Number1=component.get('v.No1');
        var Number2=component.get('v.No2');
     /*   alert(parseInt(Number1) - parseInt(Number2)); */
        component.set('v.No3', parseInt(Number1) - parseInt(Number2));
		
	},
    
	OnMul : function(component, event, helper) {
		  var Number1=component.get('v.No1');
        var Number2=component.get('v.No2');
      /*  alert(parseInt(Number1) * parseInt(Number2)); */
        component.set('v.No3', parseInt(Number1) * parseInt(Number2));
	},
    
	OnDiv : function(component, event, helper) {
		  var Number1=component.get('v.No1');
        var Number2=component.get('v.No2');
      /*  alert(parseInt(Number1) / parseInt(Number2));*/
        component.set('v.No3', parseInt(Number1) / parseInt(Number2));
	}
})