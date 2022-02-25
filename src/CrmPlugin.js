import React from 'react';
import { VERSION, Manager } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import './styles/bootstrap.css';
import './styles/theme.css';
import './styles/child.css';
import './vendors/jquery.min.js';

import CustomCrmContainer from './components/crm/CustomCrmContainer';

import NoData from './components/crm/views/no-data';

import ContactApi from './api/contact';

import ErrorHandler from './lib/Errorhandler';

import Notifier from './lib/Notifier';

import Auth from './lib/Authify';

import TicketComponent from './components/crm/views/ticket';

import store from './store/store';

import { populate, addTaskAttributes } from './store/actions';

const PLUGIN_NAME = 'CrmPlugin';

const saveTaskAttributes = async (attributes) => {

  if(!attributes) return;

  store.dispatch( addTaskAttributes(attributes));

}

const getContact = async (phone) => {


    try {
      
      var response = await ContactApi.findContact(phone);

      Notifier.showLoader();

      if(response.status == 200) {

        var data = response.data;

        var tickets = [];
        var campaign_contacts = [];
        var contact_notes = [];
        var  call_logs = [];

        if(data) {

          tickets = data.tickets;
  
          contact_notes = data.contact_notes;
  
          campaign_contacts = data.campaign_contacts;

          call_logs = data.call_logs;

        }else{
          data = {};
          data.phone = phone;          
        }
                    
        store.dispatch( populate({
          contact: data,
          tickets: tickets,
          notes: contact_notes,
          campaigns: campaign_contacts,
          call_logs: call_logs,
        }));

      }
      
    } catch (error) {

      console.error("api-response", error)
      ErrorHandler(error);
    
    }finally{
      //hide loader
      Notifier.hideLoader();
    }


}

export default class CrmPlugin extends FlexPlugin {

  constructor() {
    super(PLUGIN_NAME);
  }



  async authenticateWorker (agent_id) {

    return await Auth(agent_id);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {

    flex.AgentDesktopView.Panel2.Content.replace(<NoData key="empty-set" 
      title="No task selected" 
      size="thumbnail-3"
      subtitle="Your CRM Panel will be activated as soon as you accept a call/task" 
      img_url="https://i.ibb.co/Mcd3VVD/getting-started-project-board.png" />);

    var { agent_id } =  Manager.getInstance().workerClient.attributes;

    var isAuthenticated = await this.authenticateWorker(agent_id);

    manager.strings.NoTasks = "No available tasks, make some coffee";

    flex.MainHeader.defaultProps.logoUrl = "https://i.ibb.co/31QZwJ0/National-Lottery-Authority.jpg";
    

    flex.TaskCanvasTabs.Content.add(<TicketComponent key="ticket-panel" selectedTabName="Ticket"  />);


    flex.Actions.addListener('beforeAcceptTask', (payload, abortFunction) => {      
        
      if(!window.confirm("Are you sure you want to accept the task")) abortFunction();

  });  

      flex.Actions.addListener('afterSelectTask', (payload, abortFunction) => {      

        console.log("task payload", payload);

        if(payload.task) {

          var task_attributes = payload.task['attributes'];
  
          console.log("task payload2 - after select task", payload, task_attributes);
  
          if(!task_attributes) return;
  
          const { name } =  task_attributes;
  
          getContact(name);
  
          console.log("hit==>");
  
          saveTaskAttributes(task_attributes); 
        }else{
          location.reload(); // quick hack
        }


        flex.AgentDesktopView.Panel2.Content.remove("empty-set");
        
        flex.AgentDesktopView.Panel2.Content.replace(<CustomCrmContainer key="agent-panel" />);

    });  


    //Ex1  - After task acceptance, use the task attributes to perform a search and pop up relevant screen
    flex.Actions.addListener('afterAcceptTask', (payload, abortFunction) => { 

      window.$callData = payload;

      console.log("task payload after accept task", payload);


      //  //tells Flex to record the conference call.
      //  payload.conferenceOptions.record = 'true';

      //  //tells Flex to reach out to the url provided when the call recording file has been processed, and is available
      //  payload.conferenceOptions.recordingStatusCallback = 'https://mysite.com/recordingcallbackurl';

    }); 
    
        
    //Ex 3 - Log Activity after Agent completes the task. 
    flex.Actions.addListener("afterCompleteTask",(payload, abortFunction) => {
       //create a log of this interaction

       //location.reload();
       
       flex.AgentDesktopView.Panel2.Content.replace(<NoData key="empty-set"
       title="No task selected" 
       size="thumbnail-3"
       subtitle="Your CRM Panel will be activated as soon as you accept a call/task" 
       img_url="https://i.ibb.co/Mcd3VVD/getting-started-project-board.png" />);

      }
    );

    


    }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }



}
