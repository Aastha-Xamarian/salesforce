({   
    submit : function(component,event,helper){
        helper.submitHelper(component,event);    
    },
    
    signUpp : function(component,event,helper){
      helper.signUppHelper(component,event);  
    },
    
    logInn : function(component,event,helper){
      helper.logInnHelper(component,event);  
    },
    
    getAllQuestions: function(component,event,helper) {
        
        window.scroll(0,0);            
        var attribute = component.get('v.savebutton');
        console.log(attribute);
        component.set('v.savebutton', false);
        var divToggle= component.find('divChangeState');
        $A.util.addClass(divToggle,'slds-show');
        $A.util.removeClass(divToggle,'slds-hide');
        
        helper.getContactRecord(component,event);
        
        var divStartTestCmp= component.find('divStartTest');
        $A.util.addClass(divStartTestCmp,'slds-hide');
        $A.util.removeClass(divStartTestCmp,'slds-show');
        
    },
    
    previous: function(component,event,helper){
        
        window.scroll(0,0);
        var oppList  = component.get("v.allQuestions");
        var responseList = component.get('v.paginationList');
        var start    = component.get("v.start");
        var end= component.get('v.end');
        var pageSize = component.get("v.pageSize");
        var pageList = [];
        var counter  = 0;
 
        for(var i=0; i<responseList.length; i++){
            for(var j=0; j<oppList.length; j++){
                if(responseList[i].id==oppList[j].id){
                    oppList[j].optionSelected = responseList[i].optionSelected;
                }
            }
        }
        component.set('v.allQuestions',oppList);
        for(var i= start-pageSize; i < start ; i++){
            
            if(i <= start){
                pageList.push(oppList[i]);
                counter ++;
            }
        }
        start = start - counter;
        end = end - counter;
        component.set('v.start',start);
        component.set('v.end',end);
        component.set('v.paginationList', pageList);
        component.set('v.disableNextButton',false);
        if(end >= (oppList.length-1)){
            component.set('v.disableNextButton',true);
        }
    },
    
    next : function(component, event, helper)
    {
        var activate= component.get('v.save');
        component.set('v.save', false);
        window.scroll(0,0);
        var oppList = component.get("v.allQuestions");
        var responseList = component.get('v.paginationList');
        var end = component.get("v.end");
        var start = component.get("v.start");
        var pageSize = component.get("v.pageSize");
        var pageList = [];
        var counter = 0;
        
        for(var i=0; i<responseList.length; i++)
        {
            for(var j=0; j<oppList.length; j++)
            {
                if(responseList[i].id==oppList[j].id)
                {
                    oppList[j].optionSelected = responseList[i].optionSelected;
                }
            }
        }
        component.set('v.allQuestions',oppList);
        var quesLen = oppList.length;
        var pageNo = ((end+1)/10);
        if(pageNo ==2){
            component.set('v.save',true);
        }
        
        for(var i=end+1; i<= end+pageSize ; i++)
        {
            if(oppList.length > i)
            {
                console.log(oppList[i].question);
                pageList.push(oppList[i]);
                counter ++ ;
            }
        }
        start = start + pageSize;
        end = end + pageSize;
        component.set('v.start',start);
        component.set('v.end',end);
        component.set('v.paginationList', pageList);
        if(end >= (oppList.length-1)){
            component.set('v.disableNextButton',true);         
        }
    },
    
    closeModel : function(component,event,helper){
        component.set('v.isModalOpen',false);
        component.set('v.quizScore',0);
    },
    
    ok : function(component,event,helper){
        component.set('v.isModalOpen',false);
        component.set('v.quizScore',0);
    },
    
    showSpinner: function(component, event, helper) { 
        component.set("v.spinner", true); 
    },
    
    hideSpinner : function(component,event,helper){   
        component.set("v.spinner", false);
    },
    
    handleValueChange : function(component,event,helper){
        var countdown = component.get('v.endTime');
        if(countdown>0){
            window.setTimeout(
                $A.getCallback(function() {
                    countdown -= 1000;   
                    var minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((countdown % (1000 * 60)) / 1000);
                    var totalTimeLeft = minutes + "m : " + seconds + "s ";
                    component.set("v.endTime", countdown);
                    component.set('v.timeLeft', totalTimeLeft);
                    if(countdown<=0){
                        alert('TIME OUT');
                        helper.submitHelper(component,event);
                    }
                }), 1000);
        }
    }
})