'use babel';

import { CompositeDisposable } from 'atom';

let compconv = null;

function loadDependencies() {
  compconv = require("compconv").default;
}

export default {
  subscriptions: null,
  compconv: null,
  delayedActivationCallbackId: null,
  activated: false,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'compconv-atom:convert': () => this.convert()
    }));

    this.delayedActivationCallbackId = window.requestIdleCallback(
      () => {
        this.delayedActivate();
      },
      { timeout: 10000 }
    );
  },

  delayedActivate() {
    loadDependencies();

    this.activated = true;
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  convert() {
    if (!this.activated) {
      window.cancelIdleCallback(this.delayedActivationCallbackId);
      this.delayedActivate();
    }

    const editor = atom.workspace.getActiveTextEditor();
    const selection = editor.getLastSelection();
    const input = selection.getText();

    const output = compconv(input);

    console.log('output',output);
  }
};
