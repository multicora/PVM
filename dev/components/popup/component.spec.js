describe('popup component', function() {
  var componentController;
  var bindings;

  beforeEach(module('app'));
  beforeEach(inject(function($componentController) {
    componentController = $componentController;
    bindings = {};
  }));

  describe('stopPropagation method', function() {
    it('should call stopPropagation function on parameter', function() {
      var e = {
        stopPropagation: jasmine.createSpy('stopPropagation')
      };
      var ctrl = componentController('popup', null, bindings);

      ctrl.stopPropagation(e);
      expect(e.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('onkeyDown method', function() {
    it('should call binded "onEsc" if esc btn is pressed', function() {
      var e = {
        stopPropagation: jasmine.createSpy('stopPropagation'),
        which: 27
      };
      bindings.onEsc = jasmine.createSpy('onEsc');
      var ctrl = componentController('popup', null, bindings);

      ctrl.onkeyDown(e);
      expect(bindings.onEsc).toHaveBeenCalled();
    });

    it('should call binded "onEsc" if esc btn is pressed (event.keyCode)', function() {
      var e = {
        stopPropagation: jasmine.createSpy('stopPropagation'),
        keyCode: 27
      };
      bindings.onEsc = jasmine.createSpy('onEsc');
      var ctrl = componentController('popup', null, bindings);

      ctrl.onkeyDown(e);
      expect(bindings.onEsc).toHaveBeenCalled();
    });

    it('should call binded "onEnter" if enter btn is pressed', function() {
      var e = {
        stopPropagation: jasmine.createSpy('stopPropagation'),
        which: 13
      };
      bindings.onEnter = jasmine.createSpy('onEnter');
      var ctrl = componentController('popup', null, bindings);

      ctrl.onkeyDown(e);
      expect(bindings.onEnter).toHaveBeenCalled();
    });

    it('shouldn\'t call binded "onEnter" or "onEsc" if enter or esc btns is not pressed', function() {
      var e = {
        stopPropagation: jasmine.createSpy('stopPropagation'),
        which: 50
      };
      bindings.onEnter = jasmine.createSpy('onEnter');
      bindings.onEsc = jasmine.createSpy('onEsc');
      var ctrl = componentController('popup', null, bindings);

      ctrl.onkeyDown(e);
      expect(bindings.onEnter).not.toHaveBeenCalled();
      expect(bindings.onEsc).not.toHaveBeenCalled();
    });

    it('should mark form as a submitted', function() {
      var e = {
        stopPropagation: jasmine.createSpy('stopPropagation'),
        which: 13
      };
      bindings.onEnter = jasmine.createSpy('onEnter');
      var ctrl = componentController('popup', null, bindings);
      ctrl.form = {
        $submitted: false
      };

      ctrl.onkeyDown(e);
      expect(ctrl.form.$submitted).toBe(true);
    });
  });
});
