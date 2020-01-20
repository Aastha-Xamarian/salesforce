({
    getContactRecord : function(component,event){
        var firstName = component.get("v.fname");
        var lastName  = component.get("v.lname");
        var phoneNo   = component.get("v.phone");
        var emailAdd  = component.get("v.email");
        var action = component.get("c.fetchContact");
        action.setParams({
            "firstName1" : firstName,
            "lastName1"  : lastName,
            "phoneNo1"   : phoneNo,
            "emailAdd1"  : emailAdd         
        });
        action.setCallback(this, function(response) {   
            var state = response.getState();
            if( state == "SUCCESS"){
               var contactId = response.getReturnValue();
                component.set('v.userContactId', contactId);
                this.getAllQuestions(component,event);
                
                 }
        });
        $A.enqueueAction(action); 
    },
    
    
    getAllQuestions: function(component,event) 
    {
        component.set('v.startTest',true);
        var contactId = component.get('v.userContactId');
        var pageSize = component.get('v.pageSize');
        var action = component.get("c.getDeserialize");
        action.setParams({
            "sfContactId" : contactId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if ( state === "SUCCESS") {
                var arr = response.getReturnValue();
                console.log(arr.length);  
                for(var i=0;i<arr.length;i++)
                {
                    if (arr[i].options != null){
                        var op = arr[i].options.split(',');
                        var values = [];
                        for(var j =0; j< op.length;j++)
                        {
                            values.push({
                                label:op[j],
                                value:op[j]});     
                        }
                        arr[i].opts = values;
                        values = null;
                    }}
                component.set('v.allQuestions',arr );
                component.set('v.totalSize',10);
                component.set('v.start',0);
                component.set('v.end',pageSize-1);
                var pageList = [];
                
                for(var i=0; i< pageSize; i++){
                    pageList.push(arr[i]);
                }
                if(component.get('v.totalSize') <= pageList.length){
                    component.set('v.save',true);
                }
                component.set('v.paginationList', pageList);
                component.set('v.disableNextButton', false);
                
                var countdown = component.get('v.endTime');
                window.setTimeout(
                    $A.getCallback(function() {
                        countdown -= 1000;   
                        var minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
                        var seconds = Math.floor((countdown % (1000 * 60)) / 1000);
                        var totalTimeLeft = minutes + "m : " + seconds + "s ";
                        component.set("v.endTime", countdown);
                        component.set('v.timeLeft', totalTimeLeft);   
                        //  alert('TIME OUT');
                    }), 1000);
            }
            
        });
        $A.enqueueAction(action);
       
    },
    
    signUppHelper : function(component, event) {
        var firstName = component.get("v.fname");
        var lastName  = component.get("v.lname");
        var phoneNo   = component.get("v.phone");
        var emailAdd  = component.get("v.email");
        
        console.log(firstName + "************");
        console.log(lastName + "************");
        console.log(phoneNo + "************");
        console.log(emailAdd + "************");
        
        var action    = component.get("c.fetchContact");
        action.setParams({
            "firstName1" : firstName,
            "lastName1"  : lastName,
            "phoneNo1"   : phoneNo,
            "emailAdd1"  : emailAdd
        });
        action.setCallback(this, function(a) {
            //           var register = a.getReturnValue();
            //           console.log('name', register);
            //           alert("Succesfully Saved !")
            //       },'SUCCESS');
        });
        $A.enqueueAction(action);  
    },
    
    logInnHelper : function(component, event) {
        var firstName = component.get("v.fname");
        var lastName  = component.get("v.lname");
        var phoneNo   = component.get("v.phone");
        var emailAdd  = component.get("v.email");
        var action    = component.get("c.fetchContact");
        action.setParams({
            "firstName1" : firstName,
            "lastName1"  : lastName,
            "phoneNo1"   : phoneNo,
            "emailAdd1"  : emailAdd
        });
        action.setCallback(this, function(a) {
            //          var register = a.getReturnValue();
            //          console.log('name', register);
            //         alert("Succesfully Saved !")
            //      },'SUCCESS');
        });
        $A.enqueueAction(action);  
    },
    
    saveTestResult : function(component,score)
    {                
        var contactId = component.get("v.userContactId");
        var action = component.get("c.createTestRecord");
        action.setParams({
            "individualScore": score,
            "sfContactId" : contactId   
            
        });
        action.setCallback(this, function(response) {          
        });
        $A.enqueueAction(action);
     
    },
    
    submitHelper: function(component,event) {  
        var quesList = component.get('v.allQuestions');
        var responseList = component.get('v.paginationList');
        var scored = component.get('v.storescore');
        var score = 0;
        var unattempted = 0;
        var rightAnsCount = 0;
        var wrongAnsCount = 0; 
        var showStatus = component.get('v.status');
        console.log(responseList);
        component.set('v.allQuestions',quesList);
        if(quesList != null){
            for(var i=0; i<quesList.length; i++){
                if(quesList[i].optionSelected == null){
                    unattempted +=1;
                }
                
                else if(quesList[i].Answer == quesList[i].optionSelected){
                    rightAnsCount +=1;
                    score += 1;
                }
                    else {
                        score -= 0.25;
                        wrongAnsCount +=1;
                    };
            }
        } 
        if (score >= 5){
            component.set('v.status',"SUCCESS :)"); 
        }
        else{
            component.set('v.status',"FAILURE :(");
        }
        console.log(unattempted +'unattempted !!!');
        console.log(rightAnsCount +'rightAnsCount !!!');
        console.log(wrongAnsCount +'wrongAnsCount !!!');
        
        component.set('v.unattemptedQues',unattempted);
        component.set('v.correctAns',rightAnsCount);
        component.set('v.unCorrectAns',wrongAnsCount);
        component.set('v.quizScore',score);
        component.set('v.isModalOpen',true);
        
        this.saveTestResult(component, score);
        var divStartTestCmp= component.find('divStartTest');
        $A.util.addClass(divStartTestCmp,'slds-show');
        $A.util.removeClass(divStartTestCmp,'slds-hide');
        
        var divToggle= component.find('divChangeState');
        $A.util.addClass(divToggle,'slds-hide');
        $A.util.removeClass(divToggle,'slds-show');
        
        component.set('v.allQuestions', null);
        component.set('v.paginationList', null);
        component.set('v.startTest',false);
        component.set('v.disableNextButton',true);
        component.set('v.save',true);
        component.set('v.start',0);
        component.set('v.endTime',1800000);
           
        component.set('v.fname',null);
        component.set('v.lname',null);
        component.set('v.phone',null);
        component.set('v.email',null);
    }
})