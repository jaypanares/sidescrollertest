Game = {
  state: '', // NOTE: Is this code still needed?
  renderer: null,
  stage: null,
  animId: null,

  createRenderer(width, height, color) {
    this.renderer = PIXI.autoDetectRenderer(width, height);
    this.renderer.backgroundColor = color;
  },

  createStage() {
    this.stage = new PIXI.Container();
  },

  addChild(child) {
    this.stage.addChild(child);
    this.renderStage();
  },

  removeChildren() {
    this.stage.removeChildren(0, this.stage.children.length);
  },

  // NOTE: Is this code still needed?
  render(container) {
    this.renderer.render(container);
  },

  renderStage() {
    this.renderer.render(this.stage);
  },

  // NOTE: Is this code still needed?
  setState(name, container) {
    this.state = name;
    this.addChild(container);
  },
};
