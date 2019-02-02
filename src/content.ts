  class BlindifyContent {
    private styleTag: HTMLElement = null;
  
    constructor () {
      const styleTag = document.createElement('style');
      styleTag.setAttribute('id', 'blindify-styles');
      styleTag.innerHTML = `*,*:hover{background:#323234 !important;color:#323234 !important;cursor: help !important;position: absolute !important;height: 1px; width: 1px;overflow: hidden;clip: rect(1px 1px 1px 1px); /* IE6, IE7 */clip: rect(1px, 1px, 1px, 1px);}`;
      this.styleTag = styleTag;
      this.registerEvents.call(this);
    }
  
  
    public registerEvents() {
        browser.runtime.onMessage.addListener(this.handleMessage.bind(this));
        // browser.bookmarks.onCreated.addListener(updateActiveTab);
  
        // // listen for bookmarks being removed
        // browser.bookmarks.onRemoved.addListener(updateActiveTab);
  
        // // listen to tab URL changes
        // browser.tabs.onUpdated.addListener(updateActiveTab);
  
        // // listen to tab switching
  
        // listen for bookmarks being created
        // browser.bookmarks.onCreated.addListener(updateActiveTab);
    }

    private async handleMessage(message: any): Promise<void> {
        if (message.command === 'blindify' && message.state) {
          document.body.appendChild(this.styleTag);
        } else {
            try {
                document.body.removeChild(this.styleTag);
            } catch (e){}
        }
    }

  }
  
  new BlindifyContent();