public with sharing class JSONDeserialize {
        
        @AuraEnabled 
        public static List<QuestionForm> complex {get;set;}
        
         @AuraEnabled 
        public static void createTestRecord(Integer individualScore,string sfContactId) {
            TestResult__c testData = new TestResult__c();
            if(sfContactId!=null && sfContactId!=''){
             testData.Contact__c = sfContactId;
                }
            testData.Score_Obtained__c = individualScore;        
            testData.Attempt__c =[SELECT count() FROM TestResult__c WHERE Contact__c =: sfContactId] +1 ;
            insert testData;    
        }
        
        @AuraEnabled 
        public static id fetchContact(string firstName1, string lastName1, string phoneNo1,
                                             string emailAdd1) {
            List<Contact> listContact = new List<Contact>();
            if(emailAdd1 != Null && emailAdd1 != ''){
                listContact = [SELECT Id, FirstName, LastName, Phone, Email FROM Contact WHERE Email = :emailAdd1 LIMIT 1];
                if(listContact.isEmpty()){
                    Contact contactRecord = new Contact();
                    contactRecord.FirstName = firstName1;
                    contactRecord.Email = emailAdd1;
                    contactRecord.Phone = phoneNo1;
                    if(lastName1 != Null && lastName1 != '')
                        contactRecord.LastName = lastName1;
                    else
                        contactRecord.LastName = 'Sample Name';
                    insert contactRecord;
                    listContact.add(contactRecord);
                    
                }
                return listContact[0].id;
                }
                  return null;                               
        } 
        
        @AuraEnabled 
        public static List<QuestionForm> getDeserialize(string sfContactId) 
        {
       //     List<QuestionForm> complex = new List<QuestionForm>();
       //     List<QuestionForm> newone = new List<QuestionForm>();
            complex  = new List<QuestionForm>();
            List<QuestionForm> finalList = new List<QuestionForm>();
            Http h = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndPoint('https://us-central1-testproj-3fc74.cloudfunctions.net/getSFQuestions');
            request.setHeader('Content-type', 'application/json');
            request.setMethod('GET');
            request.setTimeout(120000);
            
            integer counter = 1;
            Integer attemptCount=0;
            if(sfContactId!=null && sfContactId!=''){
            attemptCount = [SELECT count() FROM TestResult__c WHERE Contact__c =:sfContactId];
            }
      
            HttpResponse response = h.send(request); 
    
            List<QuestionForm>  tmp = (List<QuestionForm>)JSON.deserializeStrict(response.getBody(), List<QuestionForm>.class);
          /*  return complex
            String JSONBody = '[{   "id": 1,   "questionType": 1,   "question": "Sun rises from East?",   "answer": "True",   "optionSelected": null,   "options": "True,False" }, {   "id": 2,   "questionType": 2,   "question": "How many bones are there in human body?",   "answer": null,   "optionSelected": null,   "options": "201,202,203,206" }, {   "id": 3,   "questionType": 3,   "question": "Pentagon has __ sides.",   "answer": null,   "optionSelected": null,   "options": "3,4,5,6" }, {   "id": 4,   "questionType": 2,   "question": "How many minutes are there in 1 hour?", "answer": null, "optionSelected": null, "options": "50,60,70,80" }] '
            ; 
            tmp = (List<QuestionForm>)JSON.deserializeStrict(JSONBody, List<QuestionForm>.class); */
            
            
            for(QuestionForm q : tmp)
            {
     
                QuestionForm qes = q;
                List<String> opts = new List<String>();
                if(q.questionType == 1){
                    String option = 'true,false';
                    opts = option.split(',');
                    qes.options = option;
             
                }
                else if(q.options != null)
                {
                    opts = q.options.split(',');
                    qes.Alloptions = opts;
                }
                q.id = q.id + String.valueOf(counter++);
                complex.add(q);
            }
            
            System.debug('complex ' + complex); 
            if(tmp != Null && !tmp.isEmpty()){
                if(tmp.size() >= ((Math.mod(attemptCount,4)*10)+10)){
                    for(Integer i=(Math.mod(attemptCount,4)*10); i<((Math.mod(attemptCount,4)*10)+10); i++)
                        finalList.add(tmp[i]);
                }
                else if(tmp.size() >= 10){
                    for(Integer i=0;i<10;i++)
                        finalList.add(tmp[i]);
                }
                else
                    finalList = tmp;
            }
            system.debug(tmp);
            
            return finalList;        
        }
        
        }