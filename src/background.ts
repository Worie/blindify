interface BrowserTabFingerpring {
  tabId: number;
  windowId: number;
}

class BlindifyBackground {
  private state = false;
  private stateMap: Map<string, boolean> = new Map();

  constructor () {
    this.registerEvents.call(this);
  }

  public async registerEvents() {
    this.update(this.state);

      const tabs = await browser.tabs.query({});
      tabs.forEach(tab => {
        this.stateMap.set(
          this.getSimplifiedFingerprint(tab.id, tab.windowId),
          false,
        )
      });
      browser.browserAction.onClicked.addListener(this.handleClick.bind(this));
      browser.tabs.onActivated.addListener(this.handleTabChange.bind(this));
      browser.tabs.onCreated.addListener(this.handleTabCreate.bind(this));
      browser.tabs.onRemoved.addListener(this.handleTabRemove.bind(this));
      browser.tabs.onUpdated.addListener(this.handleUpdate.bind(this));
  }

  private getSimplifiedFingerprint(tabId: number, windowId: number): string {
    return JSON.stringify({
      tabId: tabId,
      windowId: windowId,
    })
  }

  private handleUpdate(tabId: number, info: object, tab: browser.tabs.Tab): void {
    const ref = this.getSimplifiedFingerprint(tab.id, tab.windowId);

    browser.tabs.sendMessage(tab.id, {
      command: 'blindify',
      state: this.stateMap.get(ref),
    });
  }
  private handleTabCreate(tab: browser.tabs.Tab): void {
    this.stateMap.set(this.getSimplifiedFingerprint(tab.id, tab.windowId), this.state);
    this.update(this.state, tab.id);
  }
  
  private handleTabRemove(tab: browser.tabs.Tab): void {
    this.stateMap.delete(this.getSimplifiedFingerprint(tab.id, tab.windowId));
  }

  private handleClick(tab: browser.tabs.Tab): void {
    const ref = this.getSimplifiedFingerprint(tab.id, tab.windowId);
    const currentState = this.stateMap.get(ref);
    this.state = currentState;
    this.stateMap.set(ref, !this.state);
    
    this.update(!this.state, tab.id,);

    browser.tabs.sendMessage(tab.id, {
      command: 'blindify',
      state: !this.state,
    });
  }

  public handleTabChange(payload: BrowserTabFingerpring): void {
    // this.state = this.isActivated();
    const tabRef = this.getSimplifiedFingerprint(payload.tabId, payload.windowId);
    const state = this.stateMap.get(tabRef);
    this.update(state, payload.tabId,);
  }

  public update(state: boolean, tabId: number = null): void {
    browser.browserAction.setTitle({
      tabId,
      title: state ? 'Blindify enabled' : 'Blindify disabled',
    }); 

    browser.browserAction.setIcon({
      tabId,
      path: state ? 'icons/yellow-48.png' : 'icons/transparenty-48.png',
    });
  }
}

new BlindifyBackground();
