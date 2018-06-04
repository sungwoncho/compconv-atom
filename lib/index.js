'use babel';

import { CompositeDisposable } from 'atom';

let compconv = null;

function loadDependencies() {
  console.log('loadDependencies');
  compconv = require("compconv");
  console.log('done');
}

export default {
  subscriptions: null,
  compconv: null,
  delayedActivationCallbackId: null,
  activated: false,

  activate(state) {
    console.log('activate');
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
    console.log("compconv-atom: lazily activating...");
    loadDependencies();

    this.activated = true;
    console.log("compconv-atom: ready");
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  convert() {
    console.log('convert');
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
